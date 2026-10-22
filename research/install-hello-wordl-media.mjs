import fs from "node:fs";
import crypto from "node:crypto";
import sharp from "sharp";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+"\n");
const now=new Date().toISOString();
const publicDir="public/images/games/hello-wordl";
fs.mkdirSync(publicDir,{recursive:true});
const dir="research/media-candidates/hello-wordl-recapture/";
await sharp(dir+"cover-full.png").extract({left:354,top:109,width:560,height:390}).webp({quality:90}).toFile(publicDir+"/cover.webp");
for(const name of ["feedback","duplicates","long-word"])fs.copyFileSync(dir+name+".webp",publicDir+"/"+name+".webp");
const license=`MIT License

Copyright (c) 2022 Lynn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
fs.writeFileSync(publicDir+"/license.txt",license);
const media=(name,alt)=>({src:`/images/games/hello-wordl/${name}.webp`,alt,width:560,height:name==="cover"?390:650});
const paragraph=text=>({type:"paragraph",text});
const image=(name,alt,caption)=>({type:"image",...media(name,alt),caption});
const game={
 id:"hello-wordl",slug:"hello-wordl",title:"Hello Wordl",shortDescription:"Choose a word length, submit real words and turn position clues into your next guess.",status:"draft",publishedAt:null,updatedAt:null,tags:["word guessing","letter clues"],categories:["word","logic"],spoilerPolicy:"none",
 flags:{isFeaturedHome:true,isNewHome:false,isRecommendedHome:true},
 image:media("cover","Hello Wordl title and five-letter board after a submitted guess"),
 player:{iframeSrc:"https://hellowordl.net/",aspectRatio:null,orientation:"adaptive",permissionsPolicy:[],referrerPolicy:"strict-origin-when-cross-origin",sandbox:["allow-scripts","allow-same-origin"],loadTimeoutMs:30000,minimumHeight:680},
 seo:{title:"Play Hello Wordl Online — Follow Every Letter Clue",description:"Play Hello Wordl with four to eleven letters. Learn position clues, repeated letters and next guesses, then choose another word length for a fresh puzzle."},
 relatedGameIds:["poople","word-hunt","fermi","size-it-up","color","color-logo"],
 content:[
  {id:"one-word-six-rows",heading:"One hidden word, six rows of decisions",blocks:[
   paragraph("Hello Wordl asks you to identify one hidden word by submitting words of the same length. The board gives you six rows. Each completed guess leaves a set of letter clues, so the next decision should respond to the board rather than simply replace the previous word with another favorite. The target stays fixed during that puzzle; a promising letter does not become less useful because your first guess was wrong."),
   paragraph("The length control is a useful difference to notice before you begin. The visible game offers four through eleven letters, with five selected when opened in the observed version. A longer board is a different search problem, not a promise of additional guesses: look at the six rows before committing. Short words have fewer positions to track, while a long word can contain several copies of a letter and several possible word endings."),
   paragraph("Use the random game when you want another puzzle without waiting. Today's is a separate visible choice. Check the mode written below the keyboard before comparing a board with someone else. A random example on this page does not reveal today's target, and a recording of a past board should not be treated as the answer to the puzzle currently in your player.")
  ]},
  {id:"submit-a-word",heading:"Enter a complete word before asking for feedback",blocks:[
   paragraph("Select Play Now to open the game, then choose the word length before the first guess. Use the letter keys shown beneath the board to fill the active row, the backspace key to correct an entry, and Enter to submit it. Read the response before entering the next word. Filling tiles and submitting a word are separate actions; visible letters in an unfinished row are not yet evidence about the target."),
   paragraph("The length slider becomes unavailable during an active puzzle. That prevents a half-played five-letter board from silently becoming an eleven-letter board. Finish the current puzzle or use Give up before selecting another length. Giving up ends that puzzle and reveals its answer, so use it as a deliberate end-of-round choice rather than as an undo button. The length control becomes available again afterwards."),
   paragraph("Before submitting, check the whole spelling and the number of occupied cells. In the observed Normal difficulty, guesses must be valid dictionary words. A word that is familiar to you can still be outside a game's accepted list, so read the alert if an entry does not advance. Do not interpret a refused entry as a completed clue row. Keep the distinction between an editable word, a refusal message and a row with locked feedback.")
  ]},
  {id:"positions-and-absence",heading:"Read a clue as a letter and a position",blocks:[
   paragraph("A correct-position tile fixes that letter in that cell. An elsewhere tile says the letter belongs in the target but the tested position is wrong. An absent tile rules out that tested copy, with repeated-letter counts taken into account. The keyboard is a convenient reminder of letters you have tried, but the rows preserve the position information. Return to those rows when the keyboard alone no longer explains where a letter can go."),
   paragraph("In one five-letter puzzle, STARE produced five absent tiles. CHOIR then marked O and I as elsewhere while C, H and R were absent. The useful next step was not to keep the third-position O and fourth-position I. Those two positions had just been tested and refused for those letters. Keep O and I in the candidate set, move them to other positions, and avoid spending another guess on letters already excluded by these rows."),
   paragraph("This is also why a guess can be useful without containing a correct-position tile. Two elsewhere clues can reduce the choices for the next row substantially. Compare what the guess taught you with what you knew before it, rather than judging every nonwinning row as wasted. A word that repeats the same rejected positions contributes less than a word that tests a genuinely different arrangement."),
   image("feedback","STARE is absent while O and I in CHOIR are marked elsewhere","O and I remain useful letters, but their positions in CHOIR have been ruled out.")
  ]},
  {id:"repeated-letter-decisions",heading:"Repeated letters need evidence, not a blanket ban",blocks:[
   paragraph("Do not assume that a target contains each letter only once. A repeated letter can be exactly what a board needs. In a separate random puzzle, BLOOM placed M in the wrong position. MUMMY then produced correct-position M tiles in the first, third and fourth cells. The important observation is the three locked positions, not a general preference for unique-letter guesses. Removing repeated M letters from consideration would have contradicted that board."),
   paragraph("The opposite mistake is assuming that every extra copy is useful because one copy was found. Evaluate each tile. A guess containing two copies can receive different feedback for those copies, because the target may not have room for both. When one copy is correct and another is absent, preserve the confirmed copy and reconsider the extra one. An absent duplicate is not permission to erase the correct tile beside it."),
   paragraph("Separate two questions when choosing a repeated-letter guess: does the evidence allow another copy, and does the proposed position add information? Testing repetition can be worthwhile when the remaining word shapes need it. Repeating a known letter in a position already ruled out does little to resolve the uncertainty. Let the board determine which of those situations you are in."),
   image("duplicates","MUMMY shows three correct-position M tiles after BLOOM placed M elsewhere","Three M tiles are correct in this random board; repeated letters cannot be discarded automatically.")
  ]},
  {id:"longer-word-boards",heading:"Track long words one position at a time",blocks:[
   paragraph("On an eleven-letter board, use the same rules at a slower reading pace. Count the cells before carrying a clue into the next guess. It is easy to remember that a letter was near the middle while accidentally shifting it one position. A confirmed fourth cell must remain the fourth cell, even when the next candidate word looks very different from the last one."),
   paragraph("In the illustrated eleven-letter puzzle, CATERPILLAR confirmed E in cell four and R in cell five. P and the first L were elsewhere. The second L and the final R were absent. That combination matters more than a rough impression that the word contains many matching letters: the locked R should stay in place, while the absent extra R does not justify adding another R later in the word."),
   paragraph("Read repeated letters across the whole row before deciding on a word family or ending. In this example, carrying both L copies into every later guess would ignore the absent second copy. Likewise, replacing the confirmed middle letters just to try a familiar ending throws away hard evidence. Write the next candidate against the actual numbered cells, check the repeated copies, and only then submit it."),
   image("long-word","Eleven-letter CATERPILLAR row with correct middle letters and different feedback for repeated letters","The longer row still uses six guesses; compare each repeated copy and keep the confirmed positions.")
  ]},
  {id:"a-useful-next-guess",heading:"Choose what your next guess needs to resolve",blocks:[
   paragraph("After each accepted guess, identify the largest remaining uncertainty. With no present letters, a word using different letters can test more of the alphabet. With several present letters, rearranging them into legal positions becomes more valuable. With a nearly completed pattern, testing a plausible solution may be more useful than collecting broad information about letters that can no longer change the result."),
   paragraph("These aims can conflict. A guess full of new letters might reveal information while being an impossible solution under the clues you already have. A plausible solution might reuse many letters and tell you little if it is wrong. Decide which job the row is doing. With only one row left, information that cannot be used in a later guess is not a substitute for a candidate that fits the board."),
   paragraph("Before pressing Enter, compare the candidate with every completed row, not just the most recent one. Check each fixed position, each elsewhere restriction and each repeated-letter limit. A late guess often fails because it revives a letter excluded several turns earlier. The visible keyboard helps with quick recall, while the older rows help you catch that positional contradiction."),
   paragraph("There is no need to copy the speed of a video. The visible game board uses a guess limit, and the stopwatch in the all-lengths recording is the creator's overlay. Treat that recording as a way to watch the board change between word lengths and submissions. Your own useful pace is the one that leaves time to read the returned clues and avoid spending a row on a spelling or position you meant to change.")
  ]},
  {id:"readable-controls",heading:"Make the board readable before continuing",blocks:[
   paragraph("The settings panel offers a dark theme, high-contrast colors and a keyboard-layout selector, with QWERTY, AZERTY, QWERTZ, Dvorak and Colemak visible in the observed version. An Enter-on-the-left option is also present. Choose a layout you can recognize before a difficult board; an unfamiliar key arrangement adds a control problem to a word problem. Color appearance may change with settings, so use the position meaning of the feedback rather than a remembered shade alone."),
   paragraph("On a narrow screen, inspect all cells of a long row before submitting. Use the game page's Webpage Fullscreen control to expand the available area, or Browser Fullscreen where supported. If a physical keyboard is affecting the surrounding page instead of the game, focus the game or use its visible keys. The on-screen keyboard provides a direct way to test whether the entry control itself is responding."),
   paragraph("If the embedded game remains blank, use the nearby retry control rather than entering guesses into an empty area. Retrying creates a new frame and can discard the current in-frame state. Before refreshing a partly completed puzzle, understand that this website does not store or recover the provider's board. Browser storage restrictions can also affect third-party game preferences, and a previous layout choice is not proof that progress is backed up across devices.")
  ]},
  {id:"hello-wordl-questions",heading:"Questions while you play",blocks:[{type:"faq",items:[
   {question:"Can I change the length halfway through a puzzle?",answer:"The slider is disabled during an active puzzle. End that puzzle before choosing a new length. Give up reveals the current answer, so it is an end-of-round action."},
   {question:"Does an elsewhere clue tell me the final position?",answer:"It confirms that the letter belongs in the target while rejecting the position just tested. Use other rows to narrow down where it can fit."},
   {question:"Should I avoid every repeated letter?",answer:"No. The illustrated MUMMY guess has three correctly placed M tiles. Other boards can reject an extra copy, so compare each tile instead of applying a single rule to all duplicates."},
   {question:"Is the timer in the all-lengths video part of this game?",answer:"The recording's stopwatch is a creator overlay. Do not treat its speedrun time as a countdown or failure condition imposed by the visible Hello Wordl board."}
  ]},{type:"video",provider:"youtube",videoId:"VIavCrvnrDs",title:"Watch clues change across short and long boards",description:"Watch submitted guesses mark the keyboard and board as the player changes word lengths. Recorded puzzles show their guesses; the stopwatch is a creator overlay."}]}
 ]
};
const all=read("data/games/games.json");const old=all.find(g=>g.id==="krillion");
if(old){fs.mkdirSync("research/retired-game-drafts",{recursive:true});write("research/retired-game-drafts/krillion.json",old);}
const next=all.filter(g=>g.id!=="krillion"&&g.id!==game.id);next.unshift(game);for(const g of next)g.relatedGameIds=g.relatedGameIds.map(id=>id==="krillion"?"hello-wordl":id).filter((id,i,a)=>id!==g.id&&a.indexOf(id)===i);write("data/games/games.json",next);
const ledger=read("research/media-ledger.json");
for(const name of ["cover","feedback","duplicates","long-word"]){const p=publicDir+"/"+name+".webp";const bytes=fs.readFileSync(p);const m=await sharp(bytes).metadata();const entry={id:"hello-wordl-"+name,kind:name==="cover"?"image":"game-capture",originalLocation:"https://hellowordl.net/",capturedOrAccessedAt:now,rightsStatus:"approved",rightsBasis:"Author-linked Hello Wordl interface rendered from the MIT-licensed lynn/hello work, copyright 2022 Lynn. Separate live browser capture, no copied aggregator art or video frames. Complete notice retained in public/images/games/hello-wordl/license.txt and site Copyright.",licenseUrl:"https://github.com/lynn/hello/blob/main/LICENSE",captureMethod:"game-capture",videoTimecode:"",contentDescription:name==="cover"?game.image.alt:game.content.flatMap(s=>s.blocks).find(b=>b.type==="image"&&b.src.endsWith('/'+name+'.webp')).alt,versionScope:"Author-hosted Hello Wordl random puzzles; 4–11 letter controls, six-row board, observed 2026-10-21",localPath:`/images/games/hello-wordl/${name}.webp`,width:m.width,height:m.height,fileBytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),usedOn:["/games/hello-wordl"],altDirection:"Describe only the visible board, never reveal an unseen answer",slotId:"hello-wordl-"+name,videoId:null,videoAnalysisId:null,reviewedRangeIds:[],publisherName:null,reviewedTimeRange:null,embedStatus:null,ageRestrictionStatus:null,posterMediaId:null,posterLocalPath:null,subjectGameId:game.id,semanticPurpose:name==="cover"?"Game identity with accepted first guess":name==="feedback"?"Present letters in rejected positions":name==="duplicates"?"Multiple correct copies in distinct positions":"Long-board position and duplicate tracking",cropStrategy:"contain",contrastChecks:[],pagePurpose:name,status:"adopted",visualReview:"Opened processed pixels; complete title and full six-row board; body captures also retain keyboard. Native screenshot clip API was not used."};const i=ledger.items.findIndex(x=>x.id===entry.id);if(i<0)ledger.items.push(entry);else ledger.items[i]=entry;}
const video=ledger.items.find(v=>v.subjectGameId===game.id&&v.videoId==="VIavCrvnrDs");Object.assign(video,{kind:"video-embed",status:"adopted",rightsStatus:"approved",rightsBasis:"YouTube's own privacy-enhanced embed, actual playback observed through ended state; no video download or frame republication",embedStatus:"verified",ageRestrictionStatus:"clear",usedOn:["/games/hello-wordl"],slotId:"hello-wordl-video",videoAnalysisId:"hello-wordl-all-lengths",reviewedTimeRange:"00:35.549 and 01:26.95 samples; local playback progressed to 01:34.801 ended",pagePurpose:"Compare marked guesses, keyboard feedback and board lengths; creator stopwatch explicitly distinguished",width:0,height:0,fileBytes:0,posterMediaId:null,posterLocalPath:null});
ledger.status="hello-wordl-media-adopted-other-games-incomplete";write("research/media-ledger.json",ledger);
const analysis=read("research/video-analysis.json");const review=analysis.videos.find(v=>v.gameId===game.id&&v.videoId==="VIavCrvnrDs");Object.assign(review,{id:"hello-wordl-all-lengths",versionCompatibility:"verified",adoption:"adopted",pageSectionIds:["positions-and-absence","longer-word-boards","a-useful-next-guess"],pagePurpose:"Observe tile/keyboard clues across the same author's adjustable-length six-row game; do not infer a built-in clock, exact current word list or current daily target"});write("research/video-analysis.json",analysis);
const cap=read("planning/site-capabilities.json");cap.features.youtubeIframes.enabled=true;cap.features.youtubeIframes.notes="One adopted Hello Wordl video in draft content; production inclusion still follows published inventory. Privacy text describes lazy-loading requests before play.";write("planning/site-capabilities.json",cap);
const legal=read("data/site/legal.json");legal.copyright.sections=legal.copyright.sections.filter(s=>s.heading!=="Hello Wordl interface images");legal.copyright.sections.push({heading:"Hello Wordl interface images",text:license.replaceAll('\n',' ').replace(/ +/g,' ').trim()});write("data/site/legal.json",legal);
console.log({installedGame:game.id,images:4,video:1,status:"draft",retired:"krillion",mainIframeUnchanged:read("data/games/main-game.json").player.iframeSrc});
