# Weather-App

Description

This is the first iteration of a weather tracking application, developed with vanilla Javascript (with a little help from Moment.js), and Bootstrap.

App URL: https://lelandcypress.github.io/Weather-App/

User Experience

1. Upon entering either a city, or a city/state (comma seperated), the user is presented with the current weather. Of note, I used some CSS to color code the UV Index based on severity.

Screenshot here current weather

2. The user is also presented with a five day forecast starting the day after the weather displayed in the main card.

Screenshot here 5 day

3. Using Local Storage, we render the previous searches entries under the search input. If the user clicks on any of the previous searches, it will display the information in the main card and five day forecast section.

Screenshot previous search

Developer Notes
This application makes use of two endpoints of the OpenWeather API. The first endpoint will convert the user entry to latitude and longitude information that can be used to search the OpenWeather OneCall API.

If you are using this API just be aware that instead of returning 404 codes in the case of bad user input, the API will redirect you to a defaulted city or only return an empty array. So if your users are being directed to Bay Minette Alabama, you are getting the default US Search Value, and most likely this is because they are not passing in any values in the search input

The same holds true at the same level, so if users are getting the same town per state, they are getting the default value, most likely by passing in the two digit state code only. To counter this I wrote an if statement to evaluate whether the input field is blank. This does not guard against mispelled or non existent towns 

CODE HERE

Icons were genereated by OpenWeather API, who will provide you with the starter URL, and an Icon code.

CODE HERE



