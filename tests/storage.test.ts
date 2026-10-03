import {test,beforeEach} from 'node:test';import assert from 'node:assert/strict';import {webcrypto} from 'node:crypto';import {inventory,write,decisions,draft} from '../src/lib/storage';
Object.defineProperty(globalThis,'crypto',{value:webcrypto,configurable:true});let data=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{value:{getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}},configurable:true});
beforeEach(()=>{data=new Map();});
test('first run seeds seven; empty cupboard stays empty on reload',()=>{assert.equal(inventory().length,7);write('pd-inv',[]);assert.deepEqual(inventory(),[]);});
test('migrates old ingredients without overwriting them',()=>{write('pourdecisions.ingredients.v1',[{name:'French roast',category:'Coffee'}]);assert.equal(inventory()[0].name,'French roast');assert.equal(inventory()[0].category,'coffee');});
test('malformed saved decisions and draft do not crash',()=>{write('pd-decisions',[{id:'bad',date:'today',recipe:{name:'bad',temp:'hot',ingredients:[null],steps:[]}}]);assert.deepEqual(decisions(),[]);write('pd-draft',null);assert.equal(draft().recipe,null);});
