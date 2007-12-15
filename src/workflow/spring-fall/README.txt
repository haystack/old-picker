== Step 1. ==

Make sure you have Crowbar running. If you don't have Crowbar downloaded and installed yet, see
    http://simile.mit.edu/wiki/Crowbar
If you already have it installed, then on Mac OSX, just run
    /Applications/Crowbar.app/Contents/MacOS/xulrunner

== Step 2. ==

In this directory, run

    ./scrape-all-pages
    
This calls ./scrape-one-page several times to scrape several course catalogue pages into json
files inside the subdirectory scraped-json. The scraper is scraper.js in this directory.

== Step 3 ==

In this directory, run

    ./post-process-all-courses
    
This calls ./post-process-one-course several times to post-process the scraped json files. The
resulting json files are in the subdirectory processed-json.

== Step 4 ==

In this directory, run

    ./publish-json

This copies the processed json files over to the directory course-picker/src/webapp/data/spring-fall.