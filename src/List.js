import React, { Component } from 'react';

class List extends Component {
    constructor(props){
        super(props)
        this.state = {
            restaurant : [],
            search : ""
        }
    }
    componentDidMount() {
        this.callApi()
          .then(res => this.setState({ restaurant: res.express }))
          .catch(err => console.log(err));
    }
    callApi = async () => {
        const response = await fetch('http://localhost:5000/bib');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    };
    renderRestaurant = rest => {
        return(
            <div className="col-md-3">
                <img src={rest.img} className="float-left img-thumbnail rounded" width="300" height="200" alt={rest.name}/>
                <p>
                    <h4>{rest.name} </h4>
                    🗺 {rest.cp} {rest.ville}<br/>
                    🍽 {rest.cooking} <br/>
                    📞 {rest.tel} <br/>
                    👨 {rest.owner} <br/>
                </p>
            </div>
        )
    }
    onchange = e => {
        this.setState({ search: e.target.value });
    };
    render() {
        const { search } = this.state;
        const filteredRest = this.state.restaurant.filter(rest => {
            return rest.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          });
      return (
        <div className="bibList">
            <div>
                <div className="form-group">
                    <input type="text" class="form-control" placeholder="Search Restaurant" name="text1" onChange={this.onchange} icon="search" />
                </div>
            </div>
            <div className="row">
                {filteredRest.map(rest => {
                return this.renderRestaurant(rest);
                })}
            </div>
        </div>
      )
    }
  }
  export default List;