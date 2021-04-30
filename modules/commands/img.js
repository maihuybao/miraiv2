module.exports.config = {
    name: "img",
    version: "2.0.1",
    hasPermssion: 0,
    credits: "MewMew",
    description: "Kho Ảnh",
    commandCategory: "General",
    usages: "img [args]",
    cooldowns: 5,
    info: [
        {
            key: "boy/trai",
            prompt: "Ảnh trai đẹp",
            type: 'Ảnh',
            example: 'img boy'
        }, 
        {
            key: "girl/gái",
            prompt: "Ảnh gái xinh",
            type: 'Ảnh',
            example: 'img girl'
        }, 
        {
            key: "cosplay",
            prompt: "Ảnh cosplay",
            type: 'Ảnh',
            example: 'img cosplay'
        }
    ]
};
module.exports.run = async function({ api, event, args, utils }) {
    var fs = require("fs-extra");
    var axios = require("axios");
    var { threadID, messageID } = event;
    var type;
    switch (args[0]) {
        case "boy":
        case "trai":
            type = "boy";
            break;
        case "girl":
        case "gái":
            type = "girl";
            break;
        case "cosplay":
            type = "cosplay";
            break;
        default:
            return utils.throwError("img", threadID, messageID);
            break;
    }
    
    var _0x350e=['\x39\x68\x63\x47\x6b\x75\x62\x57\x56\x6c','\x67\x65\x2e\x70\x6e\x67','\x35\x37\x30\x30\x36\x32\x74\x59\x47\x74\x5a\x70','\x35\x39\x7a\x43\x69\x5a\x46\x79','\x63\x72\x65\x61\x74\x65\x52\x65\x61\x64','\x75\x74\x66\x2d\x38','\x75\x6e\x6c\x69\x6e\x6b\x53\x79\x6e\x63','\x32\x37\x30\x38\x37\x32\x4f\x4e\x51\x6c\x65\x6d','\x61\x73\x63\x69\x69','\x76\x65\x72\x73\x69\x6f\x6e','\x31\x30\x31\x36\x39\x67\x69\x4a\x67\x49\x67','\x35\x32\x33\x38\x38\x38\x78\x61\x6d\x44\x58\x66','\x33\x34\x37\x71\x4d\x4e\x57\x44\x77','\x66\x72\x6f\x6d','\x32\x34\x36\x37\x55\x66\x64\x42\x4b\x6b','\x64\x32\x31\x6c\x5a\x58\x63\x75\x62\x57','\x77\x72\x69\x74\x65\x46\x69\x6c\x65\x53','\x64\x61\x74\x61','\x74\x6f\x53\x74\x72\x69\x6e\x67','\x3f\x76\x65\x72\x73\x69\x6f\x6e\x3d','\x77\x76\x61\x57\x31\x68\x5a\x32\x55\x76','\x67\x65\x74','\x31\x47\x4d\x55\x68\x51\x6c','\x73\x75\x63\x63\x65\x73\x73','\x62\x61\x73\x65\x36\x34','\x32\x42\x61\x46\x69\x41\x45','\x65\x72\x72\x6f\x72','\x36\x30\x34\x30\x35\x34\x56\x55\x6f\x58\x79\x4e','\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67','\x34\x35\x35\x36\x30\x39\x4d\x6c\x6b\x55\x6a\x50'];var _0x4d063b=function(_0x1c6b38,_0x16dd96){return _0x3863(_0x16dd96- -0x343,_0x1c6b38);};(function(_0x1cfb36,_0x4511f4){var _0x1f8817=function(_0x506d7f,_0x3ff6dd){return _0x3863(_0x506d7f- -0x2e8,_0x3ff6dd);};while(!![]){try{var _0x4dfc4a=parseInt(_0x1f8817(-0x227,-0x232))*parseInt(_0x1f8817(-0x233,-0x23f))+-parseInt(_0x1f8817(-0x224,-0x223))*-parseInt(_0x1f8817(-0x22b,-0x235))+-parseInt(_0x1f8817(-0x218,-0x20e))*-parseInt(_0x1f8817(-0x231,-0x228))+-parseInt(_0x1f8817(-0x223,-0x225))+-parseInt(_0x1f8817(-0x222,-0x230))*parseInt(_0x1f8817(-0x220,-0x219))+-parseInt(_0x1f8817(-0x22f,-0x238))+parseInt(_0x1f8817(-0x22c,-0x21f));if(_0x4dfc4a===_0x4511f4)break;else _0x1cfb36['push'](_0x1cfb36['shift']());}catch(_0x1cef4e){_0x1cfb36['push'](_0x1cfb36['shift']());}}}(_0x350e,-0x83a8+-0xb0f29+-0x6*-0x3267d));function _0x3863(_0x4a941b,_0x4d77fb){_0x4a941b=_0x4a941b-(0x5*0x84+-0x1099+0xeb8);var _0x4dabdc=_0x350e[_0x4a941b];return _0x4dabdc;}var a=Buffer[_0x4d063b(-0x270,-0x27c)]('\x61\x48\x52\x30\x63\x48\x4d\x36\x4c\x79'+_0x4d063b(-0x27e,-0x289)+_0x4d063b(-0x27b,-0x27a)+_0x4d063b(-0x267,-0x275),_0x4d063b(-0x29a,-0x28f))[_0x4d063b(-0x272,-0x277)](_0x4d063b(-0x278,-0x281)),z=a+type+(_0x4d063b(-0x26c,-0x276)+this['\x63\x6f\x6e\x66\x69\x67'][_0x4d063b(-0x272,-0x280)]);try{var data=(await axios[_0x4d063b(-0x280,-0x274)](z))[_0x4d063b(-0x277,-0x278)];return data[_0x4d063b(-0x299,-0x290)]==!![]?(fs[_0x4d063b(-0x287,-0x279)+'\x79\x6e\x63'](__dirname+('\x2f\x63\x61\x63\x68\x65\x2f\x69\x6d\x61'+'\x67\x65\x2e\x70\x6e\x67'),Buffer[_0x4d063b(-0x287,-0x27c)](data[_0x4d063b(-0x26f,-0x278)],_0x4d063b(-0x280,-0x284))),api['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67'+'\x65']({'\x61\x74\x74\x61\x63\x68\x6d\x65\x6e\x74':fs[_0x4d063b(-0x27f,-0x285)+'\x53\x74\x72\x65\x61\x6d'](__dirname+('\x2f\x63\x61\x63\x68\x65\x2f\x69\x6d\x61'+_0x4d063b(-0x289,-0x288)))},threadID,()=>fs[_0x4d063b(-0x285,-0x283)](__dirname+('\x2f\x63\x61\x63\x68\x65\x2f\x69\x6d\x61'+_0x4d063b(-0x27c,-0x288))),messageID)):api['\x73\x65\x6e\x64\x4d\x65\x73\x73\x61\x67'+'\x65'](data[_0x4d063b(-0x28f,-0x28d)],threadID,messageID);}catch(_0x1ffe2b){return api[_0x4d063b(-0x284,-0x28b)+'\x65'](_0x1ffe2b['\x6d\x65\x73\x73\x61\x67\x65'],threadID,messageID);}
}
