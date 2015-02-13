# DNA Molecule Viewer Task

## Introduction
This repository implements a very simple single page application (SPA) that 
renders a diagram and table given some JSON data about a piece of DNA. DNA 
sequences have particular subsegments that have a special function. These are 
called DNA Features. The goal is to show a scientist the Dna Features in a
particular DNA molecule. One way of doing this is with a set of symbols called
Synthetic Biology Open Language Visual (SBOL Visual). 
Check it out here: http://www.sbolstandard.org/visual
A quick Google Search for "Plasmid Diagram" (plasmids are a type of circular
DNA molecule) will show you many different designs.

Example diagrams are in the docs folder.

## To Start
Fork this repository.

## The Task
Using a JSON fixture as a data source, make a mini-SPA to render the DNA molecule
in the browser.

### The Diagram
You should draw a diagram of the DNA molecule and its features,  a table of the
DNA molecule's features, and bind the two together. You should state how to run
or view your page in the READ.me. 

Beyond this, there are many things you can do
so this is a good place to show off your creativity. In a real world scenario,
you can think of the use case as a "viewer" or  WYSIWYG "editor".
Some additional behaviours you may want to consider are:

- Zoom, rotate, or change the scale of the diagram
- Toggle the visibility of particular features
- Show the sequence associated with particular features
- Allow a user to change the sequence or the sequence of particular features
- Allow a user to search the table of DNA features

**Creativity is more important that biological accuracy**

### It's the thought that counts...
How you solve the problem is as important as the number of features. 

**SHARE YOUR THINKING**

Narrative documents/comments like:
"first I tried x, but that didn't work so I tried y."  or "I'm not sure what a
promoter is, but I'll assume it's ... " are strongly encouraged as they let us
know where you're coming from. It's also okay to indicate future work or areas
you'd expand on in a production implementation.

Your code should:
 - follow a consistent style and set of conventions
 - be modular
 - be documented/commented
 - be testable/tested (where you feel appropriate)
 - if using a framework, follow the best practices of that framework
 
You should scaffold, structure, and package your mini-application enough so 
that '''grunt serve''' or something similar can be use to spin it up and view it.
You may assume common tools like node, grunt, bower, etc are available.
Be sure to explain how to install any dependencies, build/compile any assets, 
and generally "run" your mini application.


## Other requirements

- The Task is un-timed and you may use any resources available to you. however,
your work should be your own and you'll likely be asked to explain your design
choices.

- You can use any set of Javascript, HTML, and CSS frameworks or libraries you
 choose, but you should not use flash or other browser plugins.

- Code quality is as important as functionality, so be sure to pick a 
 consistent style, comment your code, and implement whatever tests and 
 documentation you feel are appropriate.

- You should assume the "user" is a domain expert capable of installing software
 and starting applications from the command line, but is not an expert in 
 javascript.

## When you're done
Make a Pull Request back to the parent repository. We'll likely comment on it.
Whether you implement or merge these is up to you, as they're more likely our
notes or points for discussion.


