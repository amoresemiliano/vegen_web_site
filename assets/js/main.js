document.addEventListener("DOMContentLoaded", function() {
    // Inicializar total
    syncCalculators();
});

// Sincronización Inteligente de Checkboxes en ambas calculadoras y acordeones
function syncCalculators() {
    const checkedValues = [];
    let total = 0;

    // Extraemos todos los checkboxes marcados
    const checkboxes = document.querySelectorAll('input[name="servicio-item"]:checked');
    checkboxes.forEach(cb => {
        checkedValues.push(cb.value);
    });

    // Sincronizamos las copias de los checkboxes en todo el DOM
    const allCheckboxes = document.querySelectorAll('input[name="servicio-item"]');
    allCheckboxes.forEach(cb => {
        cb.checked = checkedValues.includes(cb.value);
    });

    // Calculamos el valor final sobre valores únicos
    const uniqueChecked = document.querySelectorAll('input[name="servicio-item"]:checked');
    const uniqueValues = new Set();
    
    uniqueChecked.forEach(cb => {
        uniqueValues.add(JSON.stringify({ value: cb.value, cost: cb.getAttribute('data-cost') }));
    });

    uniqueValues.forEach(itemStr => {
        const item = JSON.parse(itemStr);
        total += parseFloat(item.cost);
    });

    // Actualizamos los contadores visuales (Hero y Bloque Final)
    const liveTotalEl = document.getElementById('liveTotal');
    const finalTotalEl = document.getElementById('finalTotal');
    
    if(liveTotalEl) liveTotalEl.innerText = total;
    if(finalTotalEl) finalTotalEl.innerText = total;
}

// Lógica de Acordeones (Calculadora)
window.toggleCalcAccordion = function(id) {
    const content = document.getElementById(`content-${id}`);
    const icon = document.getElementById(`icon-${id}`);
    
    if(!content || !icon) return;

    const isHidden = content.classList.contains('hidden');

    if (isHidden) {
        content.classList.remove('hidden');
        icon.innerText = '−';
    } else {
        content.classList.add('hidden');
        icon.innerText = '+';
    }
}

// Lógica de Acordeones Generales
window.toggleAccordion = function(id) {
    const content = document.getElementById(`content-${id}`);
    const icon = document.getElementById(`icon-${id}`);
    
    if(!content || !icon) return;

    const isHidden = content.classList.contains('hidden');

    // Cerramos todos
    const contents = document.querySelectorAll('[id^="content-acc"]');
    const icons = document.querySelectorAll('[id^="icon-acc"]');
    contents.forEach(c => c.classList.add('hidden'));
    icons.forEach(i => i.innerText = '+');

    if (isHidden) {
        content.classList.remove('hidden');
        icon.innerText = '−';
    }
}

// Envío estructurado del presupuesto configurado a WhatsApp
window.sendWhatsAppEstimate = function(source) {
    const phone = "34617741199";
    const uniqueChecked = document.querySelectorAll('input[name="servicio-item"]:checked');
    
    if (uniqueChecked.length === 0) {
        alert("Por favor, selecciona al menos un servicio del presupuestador.");
        return;
    }

    const uniqueValues = [];
    const uniqueSet = new Set();
    let total = 0;

    uniqueChecked.forEach(cb => {
        if (!uniqueSet.has(cb.value)) {
            uniqueSet.add(cb.value);
            uniqueValues.push(cb.value);
            total += parseFloat(cb.getAttribute('data-cost'));
        }
    });

    const tipoNegocioEl = document.getElementById('tipoNegocio');
    const volumenEl = document.getElementById('volumen');

    const tipoNegocio = tipoNegocioEl ? tipoNegocioEl.value : 'No especificado';
    const volumen = volumenEl ? volumenEl.value : 'No especificado';

    // Mapear los precios para el mensaje final
    const detailedServices = uniqueValues.map(v => {
        const input = document.querySelector(`input[name="servicio-item"][value="${v}"]`);
        const cost = input ? input.getAttribute('data-cost') : '0';
        return `• ${v} (${cost}€)`;
    });

    const mensaje = `Hola Vegen Digital 👋, he configurado una cotización estimada de servicios desde la web:\n\n🏢 *Mi Negocio:* ${tipoNegocio}\n📊 *Volumen:* ${volumen}\n\n🛠️ *Servicios de interés:*\n${detailedServices.join('\n')}\n\n💶 *Inversión estimada:* ${total}€\n\n📅 Me gustaría tener una reunión técnica para validar esta estructura y agendar mi *Auditoría Digital Gratuita*.`;

    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Modal de Auditoría
window.openAuditModal = function() {
    const modal = document.getElementById('auditModal');
    if(modal) modal.classList.remove('hidden');
}

window.closeAuditModal = function() {
    const modal = document.getElementById('auditModal');
    if(modal) modal.classList.add('hidden');
}

// Cerrar al hacer clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('auditModal');
    if (event.target == modal) {
        closeAuditModal();
    }
}

// Lógica de Testimonios Dinámicos (Cosmia Style)
const testimonials = [
    {
        quote: '"Antes de Vegen Digital, las comandas físicas y el inventario del almacén eran un dolor de cabeza diario. Su integración con TPV unificó todo y ahora podemos delegar la gestión con absoluta confianza."',
        author: 'Lucía Martínez',
        company: 'Propietaria de Grupo Hostelería L.M.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
    },
    {
        quote: '"Logramos automatizar la lectura de facturas recibidas y la reconciliación con nuestro ERP. Nos ahorra al menos 15 horas de gestión administrativa a la semana y cero errores humanos."',
        author: 'Carlos Mendoza',
        company: 'Director Financiero en Soluciones Logísticas S.L.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
    },
    {
        quote: '"Nuestras campañas de adquisición en Google Ads ahora son 100% trazables. Sabemos exactamente qué euro invertido se convierte en un cliente recurrente. Excelente servicio."',
        author: 'Marta Ruiz',
        company: 'Fundadora de E-commerce FreshSkin',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'
    }
];

let currentTestimonial = 0;

function updateTestimonial() {
    const container = document.getElementById('testimonial-container');
    if(!container) return;
    
    container.style.opacity = 0;
    setTimeout(() => {
        document.getElementById('t-quote').innerText = testimonials[currentTestimonial].quote;
        document.getElementById('t-author').innerText = testimonials[currentTestimonial].author;
        document.getElementById('t-company').innerText = testimonials[currentTestimonial].company;
        document.getElementById('t-avatar').src = testimonials[currentTestimonial].avatar;
        container.style.opacity = 1;
    }, 200);
}

window.nextTestimonial = function() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
}

window.prevTestimonial = function() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
}