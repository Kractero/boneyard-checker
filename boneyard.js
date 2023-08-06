import { parse } from "node-html-parser"
import { createWriteStream } from "fs"
import readline from "readline"

const txt = `RAW HTML`
const doc = parse(txt)
const names = doc.querySelectorAll('a')
const checklist = names.map(names => names.getAttribute('title'))

// const readFile = readFileSync("list.txt", 'utf-8')
// const splitNewLines = readFile.split('\n')
// const checklist = splitNewLines.map(name => name.replace('\r', ''))

const listToOut = []
const availableIns = []
async function checkBoneyard(list, i) {
    const rlInt = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const boneyardDig = await fetch(`https://www.nationstates.net/page=boneyard?nation=${list[i]}&userclick=${Date.now()}`, {
        "headers": {
            "User-Agent": ""
        }
    })
    const parseText = await boneyardDig.text()
    const document = parse(parseText)
    const status = document.querySelector('.info')
    if (status) {
        console.log(`${list[i]} is available :)))`)
        listToOut.push(list[i])
    } else {
        const error = document.querySelector('.error')
        if (error) {
            const availableIn = error.textContent.split('may become available in ')
            if (availableIn[1]) {
                availableIns.push(`${list[i]},${availableIn[1].replace('.','')}`)
                console.log(`${list[i]} will be available in ${availableIn[1].replace('.', '')}`)
            } else {
                console.log(`${list[i]} is not available, because it is in use :(`)
            }
        } else {
            console.log(`${list[i]} is not available :(`)
        }
    }
    return new Promise(resolve => rlInt.question("Press anything to continue: ", answer => {
        rlInt.close();
        resolve(answer);
    }))
}

for (let i = 0 ; i < checklist.length; i++) {
    await checkBoneyard(checklist, i);
}

const stream = createWriteStream('available names.txt');
listToOut.forEach((v) => stream.write(v + '\n') );
stream.end();

const stream2 = createWriteStream('Upcoming.txt');
availableIns.forEach((v) => stream2.write(v + '\n') );
stream2.end();
