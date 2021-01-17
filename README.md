# vivaldiBookmarkTags
A throwaway script for importing Firefox bookmark tags into the Vivaldi browser

Firefox supports tagging of bookmarks, and Vivaldi does not (at time of writing). A workaround is to add tags to the "Description" field that Vivaldi supports on bookmarks.

This is a hack for a onetime import of the tags from Firefox. No guarantees that it is working properly. I only took a guess at the structure of the Vivaldi Bookmarks file.

It seems to have worked for me on Windows 10, migrating from Firefox 84.0.2 to Vivaldi 3.5.2115.87

At the moment it needs Deno installed, see https://deno.land - if there is some interest, I could try to make a version that works in a web page.

Create a backup of the Vivaldi Bookmarks file, or for good measure, the whole "Default" folder in the Vivaldi user data folder (C:\Users\{usernam}\AppData\Local\Vivaldi\User Data\Default on Windows).

Import Firefox bookmarks into Vivalvi via the "File->Import Bookmarks and Settings" dialog in vivaldi.

Export Firefox bookmarks in Firefox in Json format, by choosing "Backup" in the bookmarks manager.

Exit the Vivaldi Browser.

copy the firefox bookmarks file (created by the backup, should have a .json extension) and the Bookmarks file from the Vivaldi "Default" folder (see above) into the same directory as the importff.js script.

open a command line in the directory of importff.js

run 

deno run --allow-read --allow-write .\importff.js .\{nameofFirefoxbookmarksfile} .\Bookmarks

(example: in my case it was deno run --allow-read --allow-write .\importff.js .\bookmarks-2021-01-14.json .\Bookmarks )

The script should generate a BookmarksUpdated.json file. Replace the "Bookmarks" file in the Vivaldi "Default" folder (see above) with the BookmarksUpdated.json file (rename the original Bookmarks file to Bookmarks.bak2, rename BookmarksUpdated.json to "Bookmarks").

Restart Vivaldi.

Because Vivaldi adds a Description field to some imported Bookmarks (presumably taken from the meta data of the bookmarked web site), tags are currently added in the form (tags: tag1,tag2,tag3...) to the end of the description.