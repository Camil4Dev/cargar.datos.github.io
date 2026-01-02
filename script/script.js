const registros = {};
const tbody = document.querySelector("#tabla-registros tbody");
const successMessage = document.getElementById("success-message");


const ZONAS_POR_PARTIDO = {
    "La Costa": [
        "San Clemente del Tuyú","Las Toninas","Santa Teresita",
        "Mar del Tuyú","Costa del Este","Aguas Verdes",
        "La Lucila del Mar","San Bernardo","Mar de Ajó","Nueva Atlantis"
    ],
    "Pinamar": ["Pinamar","Valeria del Mar","Cariló","Ostende"],
    "Villa Gesell": ["Villa Gesell","Mar Azul","Mar de las Pampas","Las Gaviotas"],
    "General Pueyrredón": ["Mar del Plata","Batán"]
};


const zonaInput = document.getElementById("zona");
const zonasList = document.getElementById("zonas-list");

Object.values(ZONAS_POR_PARTIDO).flat().forEach(z => {
    const opt = document.createElement("option");
    opt.value = z;
    zonasList.appendChild(opt);
});

function obtenerPartido(zona) {
    for (const [p, zonas] of Object.entries(ZONAS_POR_PARTIDO)) {
        if (zonas.includes(zona)) return p;
    }
    return "Sin especificar";
}


document.getElementById("dni").addEventListener("input", e => {
    e.target.value = e.target.value.replace(/\D/g, "");
});


document.getElementById("agregar").addEventListener("click", () => {
    const dni = dniInput.value.trim();
    const zona = zonaInput.value.trim();
    const nombre = nombreInput.value.trim();
    const rubro = rubroSelect.value;

    if (!dni || !zona || !nombre || !rubro) {
        alert("Completa todos los campos");
        return;
    }

    if (!registros[rubro]) registros[rubro] = [];
    registros[rubro].push({
        dni,
        nombre,
        zona,
        partido: obtenerPartido(zona)
    });

    renderTabla();
    limpiarForm();
    mostrarMensaje();
});

const dniInput = document.getElementById("dni");
const nombreInput = document.getElementById("nombre");
const rubroSelect = document.getElementById("rubro");


function renderTabla() {
    tbody.innerHTML = "";
    Object.entries(registros).forEach(([rubro, personas]) => {
        personas.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.dni}</td>
                <td>${p.zona}</td>
                <td>${rubro}</td>
                <td>${p.nombre}</td>
            `;
            tbody.appendChild(tr);
        });
    });
}


document.getElementById("exportar").addEventListener("click", () => {
    const wb = XLSX.utils.book_new();

    Object.entries(registros).forEach(([rubro, personas]) => {
        const data = [["DNI","Nombre","Partido","Zona","Rubro"]];
        personas.forEach(p => {
            data.push([p.dni, p.nombre, p.partido, p.zona, rubro]);
        });

        const ws = XLSX.utils.aoa_to_sheet(data);
        ws["!autofilter"] = { ref: `A1:E${data.length}` };
        ws["!cols"] = [
            { wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 30 }, { wch: 20 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, rubro.substring(0,31));
    });

    XLSX.writeFile(wb, "planilla_playa.xlsx");
});


function limpiarForm() {
    dniInput.value = "";
    zonaInput.value = "";
    nombreInput.value = "";
    rubroSelect.value = "";
}

function mostrarMensaje() {
    successMessage.style.display = "block";
    setTimeout(() => successMessage.style.display = "none", 2000);
}
