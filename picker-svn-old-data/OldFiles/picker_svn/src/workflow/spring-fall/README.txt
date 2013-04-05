== Step 1. ==

Make sure you have Crowbar running. If you don't have Crowbar downloaded and installed yet, see
    http://simile.mit.edu/wiki/Crowbar
If you already have it installed, then on Mac OSX, just run
    /Applications/Crowbar.app/Contents/MacOS/xulrunner

== Step 2. ==

In this directory, run

    ./process-all-courses
    
== Step 3 ==

In this directory, run

    ./publish-json

This copies the processed json files over to the directory course-picker/src/webapp/data/spring-fall.


=====

You can test scraper.js on each web page by running something like this

    ./scrape-one-page m6a
    
It will scrape m6a.html and generate scraped-json/m6a.json.
