"use strict";

//first, import bookmarks from firefox into vivaldi
//close vivaldi
//backup vivaldi data 
//read ff bookmarks and build map from urls to tags
//read vivaldi bookmarks and add tags to description if URL is in ff map

const ffBookmarksFile = Deno.args[0];
const vivaldiBookmarksFile = Deno.args[1];

const bookmarksFFdata = new TextDecoder("utf-8").decode(Deno.readFileSync(ffBookmarksFile));// "bookmarks-2021-01-14.json"));
const bookmarksVivaldiData = new TextDecoder("utf-8").decode(Deno.readFileSync(vivaldiBookmarksFile));// "Bookmarks"));

//console.log(bookmarksFFdata);

const ffJSON = JSON.parse(bookmarksFFdata);
let vivaldiSJON = JSON.parse(bookmarksVivaldiData);

//console.log(JSON.stringify(vivaldiSJON, null, 4));

//console.log("JSON parsed");

let ffMap = {};

let count = 0;
let taggedCount = 0;
let duplicateCount = 0;

function mergeTags(tags1, tags2){
    tags1 = tags1.split(",").map((x => x.trim()));
    tags2 = tags2.split(",").map((x => x.trim()));
    let tagSet = new Set();

    tags1.forEach(t => tagSet.add(t));
    tags2.forEach(t => tagSet.add(t));

    const joinedTags = Array.from(tagSet.values()).join(", ");
    
    //console.log("joined tags: "+joinedTags);

    return joinedTags;
}

function processFF(nodes){
    nodes.forEach((node) => {
        if(node.uri){
            count++;

            if(node.tags){
                let tags = node.tags;
                if(ffMap[node.uri]){
                    //console.log("duplicate uri: "+node.uri);
                    duplicateCount++;
                    tags = mergeTags(ffMap[node.uri], tags);
                }
                ffMap[node.uri] = tags;
    
                taggedCount++;
            }
        }

        if(node.children){
           // console.log("mapping children of "+node.title);
            processFF(node.children);
        }
    })
}

let vivaldiCount = 0;
let vivaldiChanged = 0;

function processVivaldiNodes(nodes){
    nodes.forEach(node => {
        if(node.url){
            vivaldiCount++;
            if(ffMap[node.url]){
                //add tags to description

                let metaInfo = node["meta_info"] || {};
                let description = metaInfo["Description"] || "";

                description = description+" (tags: "+ffMap[node.url]+" )";
                metaInfo["Description"] = description;
                node["meta_info"] = metaInfo;
                vivaldiChanged++;
            }
        }

        if(node.children) {
            processVivaldiNodes(node.children);
        }
    })
}

processFF(ffJSON.children);

console.log("roots: "+Object.keys(vivaldiSJON["roots"]))

Array.from(Object.keys(vivaldiSJON["roots"])).forEach( key => {
    processVivaldiNodes(vivaldiSJON["roots"][key]["children"]);
});

console.log("processed "+count+" nodes, found "+taggedCount+" tagged nodes"+", duplicates: "+duplicateCount);
console.log("processed vivaldi: "+vivaldiCount+", changed: "+vivaldiChanged);

Deno.writeTextFileSync(vivaldiBookmarksFile+"Updated.json", JSON.stringify(vivaldiSJON, null, 3));