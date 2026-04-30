let cart = [];
let currentQty = 1;

// ARES Vyhledávání
document.getElementById('zakaznik').addEventListener('input', function() {
    const query = this.value.trim();
    const resDiv = document.getElementById('ares-results');
    if (query.length < 3) { resDiv.style.display = 'none'; return; }
    
    fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/vyhledat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ obchodniJmeno: query, pocet: 5 })
    }).then(r => r.json()).then(data => {
        if (data.ekonomickeSubjekty) {
            resDiv.innerHTML = data.ekonomickeSubjekty.map(s => `
                <div class="ares-item" onclick="setAres('${s.obchodniJmeno}','${s.sidlo.textovaAdresa}')">
                    <b>${s.obchodniJmeno}</b><br>
                    <small>${s.sidlo.textovaAdresa}</small>
                </div>`).join('');
            resDiv.style.display = 'block';
        }
    });
});

function setAres(n, a) { 
    document.getElementById('zakaznik').value = n; 
    document.getElementById('sidlo').value = a; 
    document.getElementById('ares-results').style.display = 'none'; 
}

// Aktualizace vizuálu popelnice
function updateUI() {
    const bVal = document.querySelector('input[name="Odpad"]:checked').value;
    const bTxt = document.querySelector('input[name="Odpad"]:checked').getAttribute('data-txt');
    const size = document.querySelector('input[name="Objem"]:checked').value;
    const icon = document.getElementById('icon');
    
    icon.style.background = bVal;
    document.getElementById('inner-text').innerHTML = bTxt + "<br>" + size;
    document.getElementById('inner-text').style.color = (bTxt === 'Žlutá') ? 'black' : 'white';
    icon.style.width = (size === '1100 L') ? '140px' : '90px';
}

// Množství
function changeQty(v) { 
    currentQty = Math.max(1, currentQty + v); 
    document.getElementById('qty-val').innerText = currentQty; 
}

// Košík (nabídka)
function addToCart() {
    const bTxt = document.querySelector('input[name="Odpad"]:checked').getAttribute('data-txt');
    const size = document.querySelector('input[name="Objem"]:checked').value;
    cart.push(`${currentQty}x ${bTxt} (${size})`);
    renderCart();
    currentQty = 1; 
    document.getElementById('qty-val').innerText = "1";
}

function renderCart() {
    const area = document.getElementById('cart-area');
    area.style.display = cart.length ? 'block' : 'none';
    document.getElementById('cart-items').innerHTML = cart.map((item, i) => `
        <div class="cart-item">
            <span>${item}</span>
            <b style="color:#ef5350;cursor:pointer" onclick="removeItem(${i})">✕</b>
        </div>`).join('');
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// Příprava formuláře před odesláním
function prepare() {
    if (!cart.length) { alert("Přidejte nádoby!"); return false; }
    document.getElementById('f-z').value = document.getElementById('zakaznik').value;
    document.getElementById('f-s').value = document.getElementById('sidlo').value;
    document.getElementById('f-k').value = "Tel: " + document.getElementById('telefon').value + " | Mail: " + document.getElementById('email_klienta').value;
    document.getElementById('f-o').value = cart.join(", ");
    return true;
}
