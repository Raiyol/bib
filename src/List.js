import React, { Component } from 'react';

class List extends Component {
    constructor(props){
        super(props)
        this.state = {
            restaurant : []
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
    render() {
      return (
        <div className="bibList">
            <ul className="list-group list-group-flush">
                {
                    this.state.restaurant.map( (restaurant)=> (
                        <li className="list-group-item" key={restaurant.id}>
                            <img src={restaurant.img} className="float-left img-thumbnail rounded" width="300" height="200" alt={restaurant.name}/>
                            <div className="float-left pl-3">
                                <h4>{restaurant.name} </h4>
                                🗺 {restaurant.cp} {restaurant.ville}<br/>
                                🍽 {restaurant.cooking} <br/>
                                📞 {restaurant.tel} <br/>
                                👨 {restaurant.owner} <br/>
                                🌍 <a href={restaurant.bibURL}>Lien</a>
                            </div>
                            
                        </li>
                    ))
                }
            </ul>
        </div>
      )
    }
  }
  export default List;