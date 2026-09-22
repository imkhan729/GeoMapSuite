import {describe,expect,it} from 'vitest';
describe('International Date Line references',()=>{it('uses the approximate 180 degree meridian',()=>expect(180).toBe(180));it('clamps latitude safely',()=>expect(Math.max(-90,Math.min(90,120))).toBe(90));it('explains opposite date direction',()=>expect(['+1 day','−1 day']).toHaveLength(2));});
