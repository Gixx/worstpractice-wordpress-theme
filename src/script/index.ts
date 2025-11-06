const obj = {
    one: {
        two: {
            three: 'vau vau',
        }
    }
}

function woof(noise: string):void {
    console.log(noise)
}

woof(obj.one.two.three)