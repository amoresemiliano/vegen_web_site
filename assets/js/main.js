// Lógica para sincronizar checkboxes mutuamente exclusivos en calculadoras duplicadas
window.syncCalculators = function() {
    const checkboxes = document.querySelectorAll('input[name="servicio-item"]');
    const checkedValues = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

    // Desmarcar todos y volver a marcar solo los necesarios para mantener sincronía visual
    checkboxes.forEach(cb => {
        cb.checked = checkedValues.includes(cb.value);
    });

    // Calcular y actualizar Total
    let total = 0;
    const uniqueValues = new Set(checkedValues); // Evitar sumar duplicados
    
    uniqueValues.forEach(val => {
        const representativeCb = document.querySelector(`input[name="servicio-item"][value="${val}"]`);
        if(representativeCb) {
            total += parseFloat(representativeCb.getAttribute('data-cost') || 0);
        }
    });

    // Actualizar todos los visores de total
    const totalDisplays = document.querySelectorAll('[id^="liveTotal"]');
    totalDisplays.forEach(display => {
        display.innerText = total;
    });
}

// Lógica de Acordeones de la Calculadora (Mutuamente Exclusivos)
window.toggleCalcAccordion = function(id) {
    const content = document.getElementById(`content-${id}`);
    const icon = document.getElementById(`icon-${id}`);
    
    if(!content || !icon) return;

    const isHidden = content.classList.contains('hidden');
    
    // Close all other accordions first (Solo abre una a la vez)
    const contents = document.querySelectorAll('[id^="content-calc-acc"]');
    const icons = document.querySelectorAll('[id^="icon-calc-acc"]');
    contents.forEach(c => c.classList.add('hidden'));
    icons.forEach(i => i.innerText = '+');

    if (isHidden) {
        content.classList.remove('hidden');
        icon.innerText = '−';
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

// Envío de Formulario de Auditoría por WhatsApp
window.sendAuditWhatsApp = function(event) {
    event.preventDefault();
    const phone = "34617741199";
    const name = document.getElementById('auditName').value;
    const email = document.getElementById('auditEmail').value;
    const tel = document.getElementById('auditPhone').value;
    
    // Get multiple selected services
    const select = document.getElementById('auditServices');
    const services = Array.from(select.selectedOptions).map(opt => opt.value);
    const servicesText = services.length > 0 ? services.join(', ') : 'No especificado';

    const mensaje = `Hola Vegen Digital 👋, me gustaría agendar una *Auditoría de Sistemas Gratuita*.\n\n👤 *Nombre:* ${name}\n✉️ *Email:* ${email}\n📞 *Teléfono:* ${tel}\n🛠️ *Servicios de Interés:* ${servicesText}`;

    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    closeAuditModal();
}

// Envío de Formulario de Contacto General por WhatsApp
window.sendContactWhatsApp = function(event) {
    event.preventDefault();
    const phone = "34617741199";
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const tel = document.getElementById('contactPhone').value;
    const company = document.getElementById('contactCompany').value || 'No especificada';
    const service = document.getElementById('contactService').value;
    const userMessage = document.getElementById('contactMessage').value;

    const mensaje = `Hola Vegen Digital 👋, me gustaría hacerles una consulta.\n\n👤 *Nombre:* ${name}\n🏢 *Empresa/Web:* ${company}\n✉️ *Email:* ${email}\n📞 *Teléfono:* ${tel}\n🛠️ *Servicio de Interés:* ${service}\n\n💬 *Mensaje:*\n${userMessage}`;

    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
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

// Envío de consulta directa desde servicios (Los botones "Consultar")
window.sendConsultWhatsApp = function(title, description) {
    const phone = "34617741199";
    const mensaje = `Me interesa "${title}" donde mencionan que realizan "${description}" y quiero recibir presupuesto más detallado de vuestra propuesta. Gracias!`;
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Envío de interés por plan directamente por WhatsApp (Para la home)
window.sendPlanWhatsApp = function(planName) {
    const phone = "34617741199";
    const mensaje = `Hola Vegen Digital 👋, me interesa el plan de mantenimiento "${planName}". Me gustaría recibir más detalles para contratar.`;
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Modales de Auditoría y Presupuesto
window.openAuditModal = function() {
    const modal = document.getElementById('auditModal');
    if(modal) modal.classList.remove('hidden');
}

window.closeAuditModal = function() {
    const modal = document.getElementById('auditModal');
    if(modal) modal.classList.add('hidden');
}

window.openBudgetModal = function() {
    const modal = document.getElementById('budgetModal');
    if(modal) {
        modal.classList.remove('hidden');
    } else {
        // Fallback for index.html where the calculator is inline in the hero section
        const heroCalc = document.getElementById('heroCalculator');
        if (heroCalc) {
            heroCalc.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

window.closeBudgetModal = function() {
    const modal = document.getElementById('budgetModal');
    if(modal) modal.classList.add('hidden');
}

window.openBudgetModalAndSelect = function(accordionId, serviceName) {
    openBudgetModal();
    
    // Si estamos en una página sin modal (como index.html), busca el acordeón en la vista general
    const container = document.getElementById('budgetModal') || document;
    
    // Expandir el acordeón
    const accordionBtn = container.querySelector(`[onclick="toggleCalcAccordion('${accordionId}')"]`);
    const contentDiv = container.querySelector(`#content-${accordionId}`);
    
    if (accordionBtn && contentDiv && contentDiv.classList.contains('hidden')) {
        toggleCalcAccordion(accordionId);
    }

    // Buscar y marcar el checkbox
    const checkbox = container.querySelector(`input[name="servicio-item"][value="${serviceName}"]`);
    if (checkbox && !checkbox.checked) {
        checkbox.checked = true;
        syncCalculators(); // Actualizar el total
    }
}

// Cerrar al hacer clic fuera del contenido
window.onclick = function(event) {
    const auditModal = document.getElementById('auditModal');
    const budgetModal = document.getElementById('budgetModal');
    if (event.target == auditModal) {
        closeAuditModal();
    }
    if (event.target == budgetModal) {
        closeBudgetModal();
    }
}

// Lógica de Testimonios Dinámicos (Cosmia Style)
const testimonials = [
    {
        quote: '"Antes de Vegen Digital, las comandas físicas y el inventario de almacén eran un dolor de cabeza diario. Su integración con TPV unificó todo y ahora podemos delegar la gestión con absoluta confianza."',
        author: 'Lucía Martínez',
        company: 'Propietaria de Grupo Hostelería L.M.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
    },
    {
        quote: '"Logramos automatizar la lectura de facturas recibidas y la reconciliación con nuestro ERP. Nos ahorra al menos 15 horas de gestión administrativa a la semana y cero errores humanos."',
        author: 'Carlos Mendoza',
        company: 'Director Financiero en Soluciones Logísticas S.L.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
    },
    {
        quote: '"Nuestras campañas de adquisición en Google Ads ahora son 100% trazables. Sabemos exactamente qué euro invertido se convierte en un cliente recurrente. Excelente servicio."',
        author: 'Marta Ruiz',
        company: 'Fundadora de E-commerce FreshSkin',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120'
    },
    {
        quote: '"La optimización de nuestra agenda y sistema de reservas nos permitió aumentar nuestra ocupación en un 35% sin necesidad de contratar más personal para atención telefónica."',
        author: 'Javier Navarro',
        company: 'Director General en Clínicas Salud y Bienestar',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
    },
    {
        quote: '"Pensábamos que la IA era solo para grandes multinacionales. Vegen nos implementó un chatbot que atiende a nuestros clientes 24/7 y deriva los casos complejos. Ha sido un cambio brutal."',
        author: 'Elena Torres',
        company: 'CEO de Inmobiliaria Torres Sur',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
    },
    {
        quote: '"Los reportes mensuales solían llevarnos una semana entera de trabajo manual. Ahora, con el dashboard integrado, tenemos la rentabilidad por producto en tiempo real cada mañana."',
        author: 'Alejandro Gil',
        company: 'Gerente de Distribuciones Ibéricas',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    },
    {
        quote: '"Nuestra tienda online estaba desconectada de nuestro stock físico. Vegen unificó ambos canales y desde entonces hemos eliminado las quejas por roturas de stock o retrasos."',
        author: 'Carmen Ortega',
        company: 'Fundadora de Boutique Moda Local',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
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