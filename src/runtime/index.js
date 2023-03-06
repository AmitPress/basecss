import * as ohm from 'ohm-js'
import fs from 'fs'

const g = ohm.grammar(fs.readFileSync('src/grammars/css.ohm'))


const cst = g.match('h1{ background-color: red; }')

const semantics = g.createSemantics().addOperation('js', {
    // Program = Statement+
    Program(_statement){
    },
    // Statement = Selector "{" Body+ "}"
    Statement(_selector, _lcurly, _body, _rcurly){
        selector = _selector.js()
        return `const elem = document.createElement(${selector})`
    },
    // Selector = ElementSelector
    Selector(_elementSelector){

    },
    // Body = PVpair
    Body(_pvpair){
    },
    // PVpair = Property ":" Value ";"
    PVpair(_property, _colon, _value, _semiColon){
        property = _property
        value = _value
        return `elem.style.${property}=${value}`
    },

    _terminal(){
        return this.sourceString
    },
    _iter(...node){
        return node.map(c => c._fab())
    }

})

if(cst.succeeded()){
    const transpiled = semantics(cst).js()
    console.log(transpiled)
}else{
    console.log("No match found");
}