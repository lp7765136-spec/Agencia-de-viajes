const destinos = [
  { id:1, nombre:"Cartagena", pais:"Colombia", continente:"América", precio:850, duracion:"3 noches / 4 días", imagen:"https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800", descripcion:"Ciudad amurallada, playas, historia y rumba en el Caribe colombiano." },
  { id:2, nombre:"Medellín", pais:"Colombia", continente:"América", precio:650, duracion:"3 noches / 4 días", imagen:"https://images.unsplash.com/photo-1583531172005-814191b8b6c0?w=800", descripcion:"La ciudad de la eterna primavera, cultura, miradores y buena comida." },
  { id:3, nombre:"Cancún", pais:"México", continente:"América", precio:1450, duracion:"4 noches / 5 días", imagen:"https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800", descripcion:"Playas turquesa, todo incluido y vida nocturna." },
  { id:4, nombre:"Punta Cana", pais:"Rep. Dominicana", continente:"América", precio:1600, duracion:"4 noches / 5 días", imagen:"https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800", descripcion:"Resorts, palmeras y mar cristalino ideal para parejas y familias." },
  { id:5, nombre:"París", pais:"Francia", continente:"Europa", precio:2900, duracion:"5 noches / 6 días", imagen:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", descripcion:"Torre Eiffel, museos, moda y la ciudad más romántica del mundo." },
  { id:6, nombre:"Madrid", pais:"España", continente:"Europa", precio:2600, duracion:"5 noches / 6 días", imagen:"https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800", descripcion:"Cultura, tapas, fútbol y vida nocturna en la capital española." },
  { id:7, nombre:"Roma", pais:"Italia", continente:"Europa", precio:2800, duracion:"5 noches / 6 días", imagen:"https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", descripcion:"Coliseo, Vaticano, pasta y 2000 años de historia." },
  { id:8, nombre:"Dubái", pais:"Emiratos Árabes", continente:"Asia", precio:3500, duracion:"5 noches / 6 días", imagen:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", descripcion:"Lujo, desierto, rascacielos y compras en el Burj Khalifa." },
  { id:9, nombre:"El Cairo", pais:"Egipto", continente:"África", precio:2400, duracion:"5 noches / 6 días", imagen:"https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800", descripcion:"Pirámides de Guiza, Nilo y una de las civilizaciones más antiguas." }
];

const contenedor = document.getElementById("contenedorDestinos");
const buscador = document.getElementById("buscador");
const filtroContinente = document.getElementById("filtroContinente");
const filtroPrecio = document.getElementById("filtroPrecio");
const cotDestino = document.getElementById("cotDestino");

function mostrarDestinos(lista){
  contenedor.innerHTML = "";
  if(lista.length === 0){
    contenedor.innerHTML = "<p>No se encontraron destinos con esos filtros.</p>";
    return;
  }
  lista.forEach(d => {
    contenedor.innerHTML += `
      <div class="card">
        <img src="${d.imagen}" alt="${d.nombre}">
        <div class="card-body">
          <h3>${d.nombre}, ${d.pais}</h3>
          <p>🌍 ${d.continente} | 🕐 ${d.duracion}</p>
          <p>${d.descripcion}</p>
          <p class="precio">$${d.precio} USD / persona</p>
          <button class="btn" onclick="verDetalle(${d.id})">Ver detalle</button>
        </div>
      </div>
    `;
  });
}

function aplicarFiltros(){
  let texto = buscador.value.toLowerCase();
  let continente = filtroContinente.value;
  let precio = filtroPrecio.value;
  let filtrados = destinos.filter(d => {
    let coincideBusqueda = d.nombre.toLowerCase().includes(texto) || d.pais.toLowerCase().includes(texto);
    let coincideContinente = continente === "todos" || d.continente === continente;
    let coincidePrecio = true;
    if(precio !== "todos"){
      let [min, max] = precio.split("-").map(Number);
      coincidePrecio = d.precio >= min && d.precio <= max;
    }
    return coincideBusqueda && coincideContinente && coincidePrecio;
  });
  mostrarDestinos(filtrados);
}

function verDetalle(id){
  const d = destinos.find(x => x.id === id);
  document.getElementById("detalle").classList.remove("oculto");
  document.getElementById("detalleContenido").innerHTML = `
    <h2>${d.nombre}, ${d.pais}</h2>
    <img src="${d.imagen}" style="width:100%;max-height:350px;object-fit:cover;border-radius:14px;margin:15px 0">
    <p><b>Continente:</b> ${d.continente}</p>
    <p><b>Duración:</b> ${d.duracion}</p>
    <p><b>Precio por persona:</b> $${d.precio} USD</p>
    <p style="margin-top:10px">${d.descripcion}</p>
    <p style="margin-top:10px">Incluye: hospedaje, desayuno, traslados y tour de ciudad.</p>
    <br>
    <button class="btn" onclick="document.getElementById('cotizador').scrollIntoView({behavior:'smooth'})">Cotizar este viaje</button>
  `;
  document.getElementById("detalle").scrollIntoView({behavior:"smooth"});
}

function cerrarDetalle(){
  document.getElementById("detalle").classList.add("oculto");
}

destinos.forEach(d => {
  cotDestino.innerHTML += `<option value="${d.id}">${d.nombre} - $${d.precio}</option>`;
});

document.getElementById("formCotizador").addEventListener("submit", function(e){
  e.preventDefault();
  let personas = parseInt(document.getElementById("cotPersonas").value);
  let noches = parseInt(document.getElementById("cotNoches").value);
  let hotelTipo = document.getElementById("cotHotel").value;
  let destino = destinos.find(d => d.id == cotDestino.value);
  if(!destino || personas < 1 || noches < 1){
    alert("Por favor completa todos los datos correctamente.");
    return;
  }
  let preciosHotel = { economico: 50, estandar: 90, lujo: 180 };
  let precioHotelNoche = preciosHotel[hotelTipo];
  let precioBase = destino.precio * personas;
  let costoHotel = precioHotelNoche * noches * personas;
  let total = precioBase + costoHotel;
  document.getElementById("resultadoCotizacion").classList.remove("oculto");
  document.getElementById("resultadoCotizacion").innerHTML = `
    <h3>Resumen de tu viaje a ${destino.nombre}</h3>
    <p>✈️ Precio base (${personas} personas x $${destino.precio}): <b>$${precioBase}</b></p>
    <p>🏨 Hotel ${hotelTipo} (${personas} personas x ${noches} noches x $${precioHotelNoche}): <b>$${costoHotel}</b></p>
    <hr>
    <p style="font-size:20px">💰 <b>Total estimado: $${total} USD</b></p>
    <p style="font-size:13px;color:#666">* Este es un costo estimado, no incluye vuelos internacionales ni impuestos.</p>
  `;
});

// AQUÍ ESTÁ TU NÚMERO DE WHATSAPP
document.getElementById("formContacto").addEventListener("submit", function(e){
  e.preventDefault();
  let nombre = document.getElementById("nombre").value;
  let interes = document.getElementById("destinoInteres").value;
  let mensaje = document.getElementById("mensaje").value;
  let numero = "573146039495";
  let texto = `Hola Rumbo Aventura, soy ${nombre}. Me interesa ${interes}. ${mensaje}`;
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, "_blank");
});

buscador.addEventListener("input", aplicarFiltros);
filtroContinente.addEventListener("change", aplicarFiltros);
filtroPrecio.addEventListener("change", aplicarFiltros);
mostrarDestinos(destinos);