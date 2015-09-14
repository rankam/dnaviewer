# dnaviewer
Browser Based Viewer of DNA

## Introduction
This repository implements an interactive Plasmaid Diagram using d3.js as well as a summary table to allow users to explore the DNA Features of a particular DNA molecule. 

## Starting the app
Starting the app is simple and only requires and internet connection and for you to start a simple server in the app directory. For example, one way to start the app by doing the following:

```
$ cd app
$ python -m SimpleHTTPServer

```  
Ater doing that, navigate to http://localhost:8000/index.html and you can begin exploring the DNA molecule. Please note that the app has only been tested using Google Chrome.

## Why no MVW framework?
MVW frameworks are great, but the strength of d3.js is in its name - Data Driven Documents. With d3, you are able to control all of the data on the page as well as perform seamless updates. For a simple demo, I would have been introducing unneeded complexity into my code. I believe the simplest solution is often the best and in this instance, using pure d3.js was the simplest solution.

## Challenges
The most challenging aspect of this exercise was using data from DNA molecules because I am unfamiliar with genetics. Creating effective data visualizations often requires an intimate understanding of the data you are working with, but I simply did not have time to give myself a proper primer on genetics that I would if I were to continue working with this sort of data. In lieu of a primer, I took a look at a few Wikipedia articles and then started hacking away.

## TODO
- Learn about genetics
- Add unit tests
- Add additional labels to diagram
- Add functionality such as searching and filtering to the table