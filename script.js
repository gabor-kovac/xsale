let saleItems = Array();
let printBtn;
let printFrame;
let selectList;
let selectDiv;
let printDiv;

window.addEventListener("load", () => {
    printBtn = document.getElementById("printBtn");
    printFrame = document.getElementById("printFrame");
    selectList = document.getElementById("selectList");
    selectDiv = document.getElementById("selectDiv");
    printDiv = document.getElementById("printDiv");
});

function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet);

        console.log(parsedData); // You can now use this object as per your requirements
        
        parsedData.forEach(item => {
            saleItems.push(new SaleItem(item.ID, item.Name, item.Price, item['Sale price'], item.Qty));
        });

        console.log(saleItems);

        let printFrame = document.getElementById("printFrame");

        printFrame = saleItems[0].SavingsPerc;

        selectList.innerHTML = '';
        saleItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.ID;
            option.text = `${item.ID} - ${item.Name}`;
            selectList.appendChild(option);
        });

        selectDiv.style.display = 'block';
    };

    reader.readAsBinaryString(file);
}

function selectItems(){
    if(!selectList.selectedOptions.length){
        console.log("Nothing selected!");
        return;
    }
    printDiv.style.display = 'block';
    var options = selectList.selectedOptions;
    var values = Array.from(options).map(({ index }) => index);

    console.log(values);

    values.forEach(x => {
        var iframe = document.createElement('iframe');
        iframe.style.height = "297mm";
        iframe.style.width = "210mm";
        iframe.frameBorder = 0;

        iframe.id = "ifr"+x;

        iframe.onload = function () {
            const elementInsideIframe = iframe.contentWindow.document.createElement('div');
            elementInsideIframe.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column; align-content: center; justify-content: center; align-items: center;">
                <h1 style="text-align: center; font-family: sans-serif; font-size: 5em;">${saleItems[x].Name} on sale for ${saleItems[x].SalePrice}!</h1>
                <h2 style="text-align: center; font-family: sans-serif; color: red; font-size: 6em;">Save ${saleItems[x].SavingsPerc}% !!!</h2>
            </div>
            `;
    
            iframe.contentWindow.document.body.appendChild(elementInsideIframe);
        };

        printFrame.appendChild(iframe);
    });
}

function unselect(){
    selectList.value = "";
}

function printAll() {
    document.getElementById("printHide").style.display = 'none';
    window.print();
}

class SaleItem {
    ID;
    Name;
    Price;
    SalePrice;
    Qty;

    SavingsAmount;
    SavingsPerc;

    constructor(id, name, price, saleprice, qty){
        this.ID = id;
        this.Name = name;
        this.Price = price;
        this.SalePrice = saleprice;
        this.qty = qty;

        this.calculateSavings();        
    }

    calculateSavings(){
        this.SavingsAmount = this.Price - this.SalePrice;
        this.SavingsPerc = ((this.Price - this.SalePrice) / this.Price) * 100;
        this.SavingsPerc = this.SavingsPerc.toFixed(1);
    }
}