import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {inventory,decisions,draft,write,type Draft} from '../lib/storage';
import {type Item,type Decision} from '../lib/coffee';
function useStore(){
 const [inv,setInv]=useState(inventory),[saved,setSaved]=useState(decisions),[current,setCurrent]=useState(draft),[message,setMessage]=useState('');
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 function toast(text:string){setMessage(text);clearTimeout(timer.current);timer.current=setTimeout(()=>setMessage(''),2200);}
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 function updateInv(next:Item[]){setInv(next);if(!write('pd-inv',next))toast('Ingredients couldn’t save in this browser.');}
 function updateDraft(change:Partial<Draft>){setCurrent(old=>{const next={...old,...change};write('pd-draft',next);return next;});}
 function saveDecision(decision:Decision){const next=[decision,...saved];if(!write('pd-decisions',next))return false;setSaved(next);return true;}
 function deleteDecision(id:string){const next=saved.filter(d=>d.id!==id);if(!write('pd-decisions',next)){toast('Couldn’t delete right now. Try again.');return;}setSaved(next);toast('Decision deleted.');}
 return{inv,updateInv,saved,saveDecision,deleteDecision,current,updateDraft,toast,message};
}
type Store=ReturnType<typeof useStore>;
const Context=createContext<Store|null>(null);
export function Provider({children}:{children:ReactNode}){const store=useStore();return <Context.Provider value={store}>{children}{store.message&&<div role="status" className="toast">{store.message}</div>}</Context.Provider>;}
export function useCoffee(){const store=useContext(Context);if(!store)throw Error('Missing provider');return store;}
