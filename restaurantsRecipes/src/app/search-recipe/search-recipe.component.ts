import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as request from 'request-promise-native';
import axios from 'axios';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrls: ['./search-recipe.component.css']
})
export class SearchRecipeComponent implements OnInit {
  @ViewChild('recipe') recipes: ElementRef;
  @ViewChild('place') places: ElementRef;
  recipeValue: any;
  placeValue: any;
  venueList = [];
  recipeList = [];

  currentLat: any;
  currentLong: any;
  geolocationPosition: any;

  constructor(private _http: HttpClient) {
  }

  ngOnInit() {

    window.navigator.geolocation.getCurrentPosition(
      position => {
        this.geolocationPosition = position;
        this.currentLat = position.coords.latitude;
        this.currentLong = position.coords.longitude;
      });
  }

  getVenues() {

    this.recipeValue = this.recipes.nativeElement.value;
    this.placeValue = this.places.nativeElement.value;

    if (this.recipeValue !== null && this.recipeValue !== '') {
      this.recipeList.splice(0, this.recipeList.length - 1);
      (async () => {

        const baseUrl = 'https://api.edamam.com/search?q=' + this.recipeValue + '&app_id=ddb1c11c&app_key=bf2bffb620823a800f7c04272a426b31&from=0&to=10';
        try {
          const recipes = await axios.get(baseUrl);
          // tslint:disable-next-line:prefer-const
          let that = this;

          if (recipes.data.hits.length === 0) {
            alert('Not found-try another recipe');
          } else {
            recipes.data.hits.forEach(function (eachRecipe) {
              that.recipeList.push(eachRecipe.recipe);
            });
          }
        } catch (exception) {
          alert('Something went wrong!');
        }
      })();
    }


    if (this.placeValue != null && this.placeValue !== '') {
      this.venueList.splice(0, this.venueList.length - 1);

      (async () => {
        let baseUrl = '';
        if (this.recipeValue !== null && this.recipeValue !== '') {
          baseUrl = 'https://api.foursquare.com/v2/venues/search?categoryId=4d4b7105d754a06374d81259&client_id=YAKH5WEIBNH5NT11FGMN5MILSEAITMPLJVBC34YIW2U4SG3L&client_secret=ZTB5PH2LJQYXWKPIWOZPXOF4QJXFF3BPXZHUMR3SI1V1C0QV&near=' + this.placeValue + '&query=' + this.recipeValue + '&limit=10&v=20200609';

        } else {
          baseUrl = 'https://api.foursquare.com/v2/venues/search?categoryId=4d4b7105d754a06374d81259&client_id=YAKH5WEIBNH5NT11FGMN5MILSEAITMPLJVBC34YIW2U4SG3L&client_secret=ZTB5PH2LJQYXWKPIWOZPXOF4QJXFF3BPXZHUMR3SI1V1C0QV&near=' + this.placeValue + '&limit=10&v=20200609';
        }

        try {
          const venues = await axios.get(baseUrl);
          // tslint:disable-next-line:prefer-const
          let that = this;
          if (venues.data.response.venues.length === 0) {
            alert('Not found-try another restaurant');
          } else {
            venues.data.response.venues.forEach(function (eachVenue) {
              that.venueList.push(eachVenue);
            });
          }
        } catch (exception) {
          alert('error-invalid location');
        }
      })();

    }
  }
}
