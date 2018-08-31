let expect = require('expect');

const {stringValidation} = require('./validation')


describe('isRealString', ()=>{

    it('should reject non-string values', ()=>{
        let realString = stringValidation(6)
        expect(realString).toBeFalsy()
    })

    it('should reject string with only spaces', ()=>{
        let realString = stringValidation('         ');
        expect(realString).toBeFalsy();
    })

    it('should allow string with non-space characters', ()=>{
        let realString = stringValidation('   Andrew ');
        expect(realString).toBeTruthy();
    })

})
