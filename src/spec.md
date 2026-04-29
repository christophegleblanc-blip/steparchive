Specifications for pack upload:

------------------------------------
Pack Structure:
------------------------------------

A Pack is a collection of songs for the rhythm game StepMania. These packs are usually in a zip or rar format.
Within this zip is the main folder of the pack, which contains the name of the pack.
In the main pack folder is a series of folders which contain data for each song in the pack.
Each song folder contains various files required to play in StepMania. 
What's important for us is the .sm and .ssc files. These contain most of the data relating to the steps of a song.
If a .ssc file exists, we ignore the .sm file if there is one. Otherwise we can use the .sm file by default.
If neither file format exist, this is not a valid simfile and we simply skip it.
Thus, the structure should look like this:

Example Pack 1.zip
|
----- Example Pack 1
      |
      ----- Song 1
            |
            ----- song1.ssc
            ----- song1.sm
            ----- song1.mp3
            ----- song1-bn.png
      ----- Song 2
            |
            ----- song2.ssc
            ----- song2.ogg

We want to count the number of songs folders. Now this data can be filled in our Pack interface defined in types.ts
name is the name of the parent folder
numberOfSongs is the number of songs folders we counted
year we will default to 2026 for now
songs is an array of songs objects which we will fill in the next section.
Once we have this data, we want to traverse through each songs folder and find the .ssc file to fill its song object data

------------------------------------
.ssc file format:
------------------------------------

The first section of the .ssc file is a set of information fields, delimited by # at the beginning and ended with ;
For example, the title of the song would be written as follows: #TITLE: Song 1;
For now, we only care about the TITLE, ARTIST and BPMS fields.
These fields should be mapped into the Song interface defined in types.ts:
TITLE is title
ARTIST is artist
BPMS is bpm
Length we currently put a dummy value, i.e. 2:30
difficulties we will fill using the next section.

Next comes the actual simfile data that's used by StepMania. 
Each chart for a song (for which there can be multiple) begins with:
#NOTEDATA:;
This is an indicator that the next lines contain data for a new chart.
We are only concerned with the following fields, which are delimited identically to the information fields at the beginning of the file (i.e. #field: test;):
#STEPSTYPE:dance-single;
#DIFFICULTY:Hard;
#METER:9;
#CREDIT:Kommisar;
This example identifies what type of chart we're looking at.
STEPSTYPE is dance-single, which means 4 panel.
DIFFICULTY is the name describing the difficulty of the chart.
METER is the number value associated with the difficulty of the chart.
CREDIT is the person who wrote the chart, although this field may be empty.
You'll eventually reach a field called #NOTES:
This is where the actual notes are written. For this project we're not concerned with parsing this data.
We only care about the point where we reach a semicolon (;). This indicates the end of the notes.
If there is another chart, we restart the process by parsing the data starting from #NOTEDATA:;

once we reach the end of the .ssc file, the last character should be one last semicolon marking the end of the last notes section.

This song data should be mapped to the difficulty interface defined in types.ts
METER is level
STEPSTYPE is type
DIFFICULTY is difficulty

once we have all this data, we should have our pack object filled in with the songs, difficulties, and other attributes.
We now want to append this data to its associated year json, i.e. 2025.json.