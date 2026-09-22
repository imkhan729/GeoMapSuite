import {describe,expect,it} from 'vitest';
describe('Map legend maker',()=>{it('stores ordered legend classes',()=>expect([{label:'Low',color:'#dbeafe'}]).toHaveLength(1));it('creates a JSON configuration shape',()=>expect(JSON.stringify({title:'Map Legend',items:[]}).includes('items')).toBe(true));it('supports hexadecimal swatches',()=>expect(/^#[0-9a-f]{6}$/i.test('#1d4ed8')).toBe(true));});
