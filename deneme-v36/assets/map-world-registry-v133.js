/* Matematik Evreni v133 — single expansion registry for every game scene.
   The approved first tile and its three chapters live in world-map-v133.js.
   Do not add an unapproved image or playable stage just to fill a blank tile.
   Future artists supply a tile matching the previous tile's shared 110px edge,
   then add data once in this manifest (all game scenes load this exact file). */
(function(){
 "use strict";
 const api=window.MTKWorldMap;
 if(!api)throw new Error("Macera haritası yüklenemedi");
 const STYLE_KEY="matematik-evreni-premium-3d-v1";
 const NEW_TILES=[];
 const NEW_CHAPTERS=[];
 // SAMPLE — for a future, approved extension ONLY (not currently in the game):
 // NEW_TILES.push({id:"fourth-tile",afterTile:"origin",side:"right",
 //   overlap:110,w:1671,h:941,src:"./assets/fourth-tile.avif",
 //   styleKey:STYLE_KEY});
 // NEW_CHAPTERS.push({id:"chapter-four",name:"(Onaylanacak bölüm adı)",
 //   tileId:"fourth-tile",localX:730,localY:490,after:"observatory",
 //   rx:190,ry:84,playable:false,route:null,
 //   fogPolygon:[[0,0],[1671,0],[1671,941],[0,941]]});
 for(const tile of NEW_TILES)if(!api.registerTile(tile))throw new Error("Harita parçası geçersiz: "+tile.id);
 for(const chapter of NEW_CHAPTERS)if(!api.registerChapter(chapter))throw new Error("Bölge tanımı geçersiz: "+chapter.id);
 window.MTKWorldRegistry=Object.freeze({version:133,styleKey:STYLE_KEY,
  tileCount:api.tiles().length,chapterCount:api.chapters().length});
})();
