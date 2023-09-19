function convertFormat(persons) {
    let newTable = []
    let array_tel = []
    for(let next = 0; next < persons.length; next++){
        if(newTable.length == 0){
            newTable.push(persons[next])
        }else{
            newTable.forEach((table) => {
                if(table.name == persons[next].name && table.code == persons[next].code && table.tel != persons[next].tel){
                    array_tel.push(table.tel)
                    array_tel.push(persons[next].tel)
                    table.tel = array_tel
                }
            })
            if(array_tel.length > 0){
                array_tel = []
            }else{
                newTable.push(persons[next])
            }
        }
    }
    return newTable;
}

let obj = [
    { name: "Alex", tel: "0991112222", code: "xsf0001"},
    { name: "Jane", tel: "0812221234", code: "xsf0002"},
    { name: "Alex", tel: "0832214433", code: "xsf0001"},
    { name: "Alex", tel: "0991113122", code: "xsf0003"}
    ]
    
let table = convertFormat(obj)
console.table(table)

function convertFormat2(datas){
    let newData = []

    if(datas.contact.length > 1){
        for(let next = 0; next < datas.contact.length; next++){
            let data = {
                customer : datas.customer,
                contact : datas.contact[next],
                address : datas.address
            }
            if(!!(data.customer && data.contact && data.address)){
                newData.push(data)
            }
        }
    }
    return newData
}

let obj2 = { 
        customer: "Xsurface", 
        contact: [
            {name: "Max"},
            {name: "Mike"},
            {name: "Adam"}
        ],
        address: "Sukhumvit 62",
}

let customers = convertFormat2(obj2)
console.table(customers)
