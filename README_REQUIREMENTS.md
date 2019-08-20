## Overview 
The goal of this is to write a simple command-line program that will print out a list of food trucks, given a source of food truck data from the San Francisco government’s API. 


## The Task 
#### Data 
The San Francisco government’s website has a public data source of food trucks (https://data.sfgov.org/Economy-and-Community/Mobile-Food-Schedule/jjew-r69b). The data can be accessed in a number of forms, including JSON, CSV, and XML. How you access the data is up to you, but you can find some useful information about making an API request to this data source here (https://dev.socrata.com/foundry/data.sfgov.org/bbb8-hzi6). 


## The Problem 
Write a command line program that prints out a list of food trucks that are open at the current date and current time, when the program is being run. So if I run the program at noon on a Friday, I should see a list of all the food trucks that are open then. 


## Criteria 
We will primarily evaluate programs on code quality and output correctness. 

For quality, we expect code to be easy to read and maintain, performant, testable and reliable. You should submit code that you are proud to have written. However do not include tests in your submission.

Please display results in pages of 10 trucks. That is: if there are more than 10 food trucks open, the program should display the first 10, then wait for input from the user before displaying the next 10 (or fewer if there are fewer than 10 remaining), and so on until there are no more food trucks to display. Display the name and address of the trucks and sort the output alphabetically by name. 

Requirement list:
* Food Trucks are sorted alphabetically
* There are clear comments or self-documenting code
* Clear naming conventions
* Concise and readable code
* Code is broken up into multiple classes and methods based on responsibility
* Clean output from program
* Error cases addressed and properly handled
* Code is testable
