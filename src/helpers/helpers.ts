import CryptoJS from "crypto-js";

export const encrypt = (value: string): string => {
    
    return CryptoJS.AES.encrypt(value, process.env.SECRETHASH ? process.env.SECRETHASH : "").toString();
};

export const decrypt = (value: string): string => {
    var bytes = CryptoJS.AES.decrypt(value, process.env.SECRETHASH ? process.env.SECRETHASH : "");

    return bytes.toString(CryptoJS.enc.Utf8);
};


export const hashMD5 = (value: string): string => {

    return CryptoJS.MD5(value).toString();
};
export const getDay = function () {

    return (new Date().getTime() / 1000).toString()
}

export const generateRange = function (numbers: any) {
    let min = Math.min(numbers.initial, numbers.finish);
    let max = Math.max(numbers.initial, numbers.finish);
    let output = Array.from({ length: max - min + 1 }, (v, i) => i + min);
    if (numbers.initial > numbers.finish) output.reverse();

    return output;
}



