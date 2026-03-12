/* ============================================================
   NOXOLO DUMA PHYSIOTHERAPY — JAVASCRIPT
   ============================================================ */

// ── PAGE NAVIGATION ───────────────────────────────────────
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + pageId);
    if (page) {
        page.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.page === pageId);
    });
    if (pageId === 'home') setTimeout(animateCounters, 400);
}

// ── MOBILE MENU ────────────────────────────────────────────
function toggleMenu() {
    document.getElementById('mobileNav').classList.toggle('open');
}

// ── MODALS ─────────────────────────────────────────────────
function openBooking() {
    const d = document.getElementById('bookDate');
    if (d) d.min = new Date().toISOString().split('T')[0];
    openModal('bookingModal');
}
function closeBooking()        { closeModal('bookingModal'); }
function closeSuccess()        { closeModal('successModal'); }
function closeTeamModal()      { closeModal('teamModal'); }
function closeServiceModal()   { closeModal('serviceModal'); }
function openInstagramModal()  { openModal('instagramModal'); }
function closeInstagramModal() { closeModal('instagramModal'); }

function openModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}

document.addEventListener('click', e => {
    document.querySelectorAll('.modal.open').forEach(modal => {
        if (e.target === modal) closeModal(modal.id);
    });
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal.open').forEach(m => closeModal(m.id));
});

// ── FORM HANDLERS ──────────────────────────────────────────
function handleBooking(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // Send booking to server-side PHP
    fetch('send_booking.php', {
        method: 'POST',
        body: formData
    }).then(res => res.json()).then(data => {
        if (data && data.success) {
            const email = formData.get('bookEmail') || 'your email';
            closeBooking();
            setTimeout(() => {
                document.getElementById('successEmailDisplay').textContent = email;
                openModal('successModal');
                form.reset();
            }, 300);
        } else {
            alert('Unable to send booking. Please try again or email mbhelelindo23@gmail.com');
        }
    }).catch(err => {
        console.error('Booking send error', err);
        alert('Network error — could not send booking. Please try again later.');
    });
}

function handleContact(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    fetch('send_contact.php', {
        method: 'POST',
        body: formData
    }).then(res => res.json()).then(data => {
        if (data && data.success) {
            alert('✅ Message sent successfully!\n\nThank you for reaching out to Noxolo Duma Physiotherapy. We\'ll get back to you within 24 hours.');
            form.reset();
        } else {
            alert('Unable to send message. Please try again or email mbhelelindo23@gmail.com');
        }
    }).catch(err => {
        console.error('Contact send error', err);
        alert('Network error — could not send message. Please try again later.');
    });
}

// ── TESTIMONIALS ────────────────────────────────────────────
let currentT = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots   = document.querySelectorAll('.t-dot');

function goTestimonial(idx) {
    slides[currentT]?.classList.remove('active');
    dots[currentT]?.classList.remove('active');
    currentT = (idx + slides.length) % slides.length;
    slides[currentT]?.classList.add('active');
    dots[currentT]?.classList.add('active');
}
function nextTestimonial() { goTestimonial(currentT + 1); }
function prevTestimonial() { goTestimonial(currentT - 1); }
setInterval(nextTestimonial, 7000);

// ── COUNTERS ────────────────────────────────────────────────
let countersRun = false;
function animateCounters() {
    if (countersRun) return;
    countersRun = true;
    document.querySelectorAll('.stat-num').forEach(el => {
        const target = +el.dataset.target;
        const step = target / (1800 / 16);
        let current = 0;
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current);
            if (current >= target) clearInterval(timer);
        }, 16);
    });
}

const heroEl = document.querySelector('.hero');
if (heroEl) {
    new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) animateCounters();
    }, { threshold: 0.4 }).observe(heroEl);
}

// ── SCROLL ANIMATIONS ───────────────────────────────────────
function revealItems() {
    const selector = '.service-card, .value-card, .accred-item, .team-card, .research-card, .qual-card, .contact-card, .service-full-card';
    document.querySelectorAll(selector).forEach((el, i) => {
        if (el.dataset.revealed) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = `opacity .5s ease ${(i % 4) * 80}ms, transform .5s ease ${(i % 4) * 80}ms`;
        new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.dataset.revealed = '1';
            }
        }, { threshold: 0.1 }).observe(el);
    });
}

// ── TEAM MODAL DATA (Noxolo Duma — real profile) ────────────
const teamData = {
    noxolo: {
        name: 'Noxolo E. Duma',
        role: 'Founder & Physiotherapist',
        img: 'Noxolo-Duma-Team-Image.webp',
        qual: 'Founder · Director · PhD Candidate · UKZN',
        tags: ['Neurological Rehab', 'Orthopaedics', 'Cardiothoracic', 'Public Health', 'Leadership'],
        bio: 'Noxolo Erica Duma is the Founder and Director of Noxolo Duma Physiotherapy. She holds a Bachelor of Physiotherapy from the University of KwaZulu-Natal and a Master\'s in Public Health, completed in 2019 under the supervision of the late Professor TE Madiba. She is currently completing her Doctor of Philosophy (PhD) under the supervision of Professor KW Hlongwana and Dr NA Benjamin-Damons, reflecting her strong commitment to academic excellence and evidence-based practice.',
        bio2: 'Noxolo completed her community service at Christ The King Hospital in Ixopo in 2014, where she developed a strong foundation in outreach programmes, health promotion, and community-based care. In 2015, she joined Addington Hospital, gaining extensive experience across Intensive Care Units, Orthopaedics, Paediatrics, Surgical and Medical wards, as well as amputation, neurology, cardiac rehabilitation, and orthotics and prosthetics clinics. These diverse rotations strengthened her clinical expertise and shaped her holistic approach to patient care.',
        extra: 'Her exposure to community health initiatives inspired her transition from individual patient management to a broader public health perspective, motivating her pursuit of advanced studies in Public Health to better understand and improve healthcare service delivery at a systems level. Noxolo established her private practice in 2017 while still serving in the public sector and later transitioned fully into private practice to focus on expanding quality physiotherapy services. Her special interests include neurological rehabilitation, orthopaedics particularly total knee and hip replacements and cardiothoracic rehabilitation. Outside of her professional life, Noxolo enjoys reading research literature, exploring new destinations with her family, and has a unique fascination with lions and tigers. Her blend of clinical expertise and visionary leadership continues to shape the growth and impact of her practice. <a href="https://www.researchgate.net/profile/Noxolo_Duma2" target="_blank" style="color:var(--teal); font-weight:600;">View research profile on ResearchGate →</a>'
    },
    silondile: {
        name: 'Silondile S. Nkala',
        role: 'Physiotherapist',
        img: 'Silondile-Team-Image.webp',
        qual: 'MSc Physio candidate (WITS); B. Physio (UKZN)',
        tags: ['Patient-Centred Care', 'Holistic Rehab', 'Evidence-Based'],
        bio: 'Silondile Sibonile Nkala is a passionate and dedicated Physiotherapist committed to delivering high-quality, patient-centred care. She holds a Bachelor of Physiotherapy from the University of KwaZulu-Natal. Now in her fourth year of professional practice, she continues to expand her clinical expertise and professional development. She is currently registered for a Master\'s in Physiotherapy at the University of the Witwatersrand, further strengthening her knowledge and commitment to evidence-based practice.',
        bio2: 'Silondile is driven by a genuine desire to help individuals regain function, restore mobility, and improve their overall quality of life. She takes pride in creating a supportive, encouraging, and empowering treatment environment where patients feel heard, understood, and motivated throughout their recovery journey. Her approach is holistic and tailored, ensuring that each patient receives personalised care aligned with their unique goals and needs. She enjoys treating a wide variety of physiotherapy conditions and values the diversity that comes with working across different patient presentations. For Silondile, every case is important. Her primary goal during each session is to ensure patients leave feeling relief, measurable improvement, and renewed hope. Witnessing her patients progress whether through reduced pain, improved strength, restored mobility, or achieving meaningful milestones is the most rewarding aspect of her work. Beyond her clinical role, Silondile is warm, approachable, and values personal growth. She enjoys reading novels and immersing herself in compelling stories, and she is known for her fun-loving nature and love of laughter. Her balance of professionalism, compassion, and enthusiasm makes her a trusted and valued member of the practice.'
    },
    nompumelelo: {
        name: 'Nompumelelo G. Geza',
        role: 'Practice Manager',
        img: 'Nompumelelo.jpg',
        qual: 'Diploma in Nursing; Business Administration; ECD',
        tags: ['Operations', 'Patient Care', 'Leadership'],
        bio: 'Nompumelelo Gracious Geza is an accomplished and compassionate Practice Manager with a strong multidisciplinary foundation in healthcare and administration. She holds qualifications in Business Administration, a Certificate in Early Childhood Development (ECD) and Education, and a Diploma in Nursing, equipping her with a well-rounded skill set that bridges clinical expertise, operational leadership, and patient-centered care.',
        bio2: 'With a natural warmth and welcoming presence, Nompumelelo is deeply committed to creating a supportive and efficient healthcare environment where both patients and staff feel valued. Her background in nursing gives her a genuine understanding of patient needs, while her training in business administration enables her to lead with structure, strategy, and operational excellence. This unique combination allows her to manage practice operations effectively while maintaining a compassionate, human-centered approach. She is passionate about making a meaningful difference in the lives of others. For Nompumelelo, the most rewarding part of her role is witnessing patients recover and return with gratitude and renewed smiles. Knowing that her leadership contributes to positive health outcomes and uplifting experiences is what makes the hard work worthwhile. Driven, loving, and dedicated, she approaches her work with integrity, empathy, and a strong sense of purpose. Outside of her professional responsibilities, Nompumelelo is a proud tea enthusiast — a self-proclaimed tea connoisseur who enjoys discovering and savoring new blends whenever she gets the chance.'
    },
    khanyiswa: {
        name: 'Khanyiswa M. Ndziweni',
        role: 'Administrator',
        img: 'Khanyiswa.jpg',
        qual: 'Computer Certificate - Aviation Certificate (Skyy Aviation Academy)',
        tags: ['Front Desk', 'Patient Support', 'Administration'],
        bio: 'Khanyiswa Miranda Ndziweni is a driven and hardworking Medical Secretary. With a strong passion for excellence and a natural ability to connect with people, she plays a key role in ensuring smooth day-to-day operations while creating a welcoming and professional environment for patients.',
        bio2: 'With experience in customer engagement, Khanyiswa brings strong communication skills, efficiency, and attention to detail to her role. She holds a Computer Certificate equipping her with essential administrative and technical skills, as well as an Aviation Certificate from Skyy Aviation Academy a testament to her ambition, versatility, and commitment to continuous growth. Khanyiswa approaches her work with enthusiasm and professionalism, And she provides exceptional support to both patients and the team. Khanyiswa can recite the entire script of her favourite movie, a reflection of her vibrant personality and impressive memory.'
    }
};



function openTeamModal(key) {
    const d = teamData[key];
    if (!d) return;
    document.getElementById('teamModalContent').innerHTML = `
        <div class="tm-header">
            <div class="tm-avatar"><img src="${d.img}" alt="${d.name}"></div>
            <div class="tm-meta">
                <h2>${d.name}</h2>
                <span class="team-role">${d.role}</span>
                <p style="font-size:.85rem;color:var(--grey);margin:.4rem 0">${d.qual}</p>
            </div>
        </div>
        <div class="tm-body">
            <p>${d.bio}</p>
            <p>${d.bio2}</p>
            ${d.extra ? `<p style="margin-top:.5rem;">${d.extra}</p>` : ''}
            <button class="btn-primary full-width" onclick="closeTeamModal();openBooking();">
                Book with your appointment
            </button>
        </div>`;
    openModal('teamModal');
}

// ── SERVICE DETAIL MODAL ────────────────────────────────────
const serviceData = {
    paeds: {
        icon: '👶', title: 'Paediatric Rehabilitation',
        img: 'Noxolo-Duma-With-Baby.webp',
        intro: '',
        treats: ['Cerebral Palsy (all GMFCS levels)', 'Developmental delays and motor dysfunction', 'Paediatric neurological conditions', 'Musculoskeletal conditions in children', 'Post-surgical paediatric rehabilitation'],
        duration: '45–60 min', sessions: 'Individualised programme'
    },
    neuro: {
        icon: '🧠', title: 'Neurological Rehabilitation',
        img: 'Neurological-Rehab-Image.webp',
        intro: 'Our approach is grounded in the latest clinical research and interprofessional rehabilitation frameworks.',
        treats: ['Stroke', '⁠Traumatic brain injury', 'Balance and co-ordination disorders', 'Spinal cord injuries'],
        duration: '60 min', sessions: 'Long-term ongoing programme'
    },
    manual: {
        icon: '🤲', title: 'Manual Therapy',
        img: 'Silondile-Manual-Therapy-Image.webp',
        intro: 'Hands-on physiotherapy using mobilisation, manipulation, and soft tissue techniques to reduce pain, restore joint mobility, and improve functional movement patterns.',
        treats: ['Acute and chronic back pain', 'Neck pain and stiffness', 'Headaches of cervical origin', 'Hip and shoulder conditions', 'Post-injury joint stiffness'],
        duration: '45–60 min', sessions: '4–8 sessions recommended'
    },
    ortho: {
        icon: '🦴', title: 'Orthopaedic Rehabilitation',
        img: 'Orthopaedic-Rehabilitation-Image.webp',
        intro: 'Rehabilitation following orthopaedic surgery and musculoskeletal injury focused on restoring strength, mobility and return-to-function through progressive loading and tailored exercise.',
        treats: ['Total knee and hip replacement rehab', 'Post-operative mobilisation and strengthening', 'Soft-tissue injury rehab', 'Tendon and ligament recovery', 'Post-fracture rehabilitation'],
        duration: '45–60 min', sessions: '4–12 sessions (individualised)'
    },
    electro: {
        icon: '⚡', title: 'Electrotherapy',
        img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=320&fit=crop&q=80',
        intro: '',
        treats: ['Transcutaneous electrical nerve stimulation', 'Interferential therapy', 'Shockwave therapy', 'Ultrasound therapy', 'Shortwave diathermy'],
        duration: '30–45 min', sessions: 'Often used adjunctively across course of care'
    },
    respiratory: {
        icon: '🫁', title: 'Respiratory Physiotherapy',
        img: 'Respitory-Physio-Image.webp',
        intro: '',
        treats: ['COPD', 'Asthma', 'Bronchitis', 'Pneumonia'],
        duration: '30 min', sessions: 'Programme-based / ongoing'
    },
    dryneedling: {
        icon: '⚕️', title: 'Dry Needling (IMS)',
        img: 'Dry-Needling-Image.webp',
        intro: 'This technique involves the insertion of needles into myofascial trigger points. It reduces pain, increases blood flow, and restores optimal nerve function. It relaxes tight muscles.',
        treats: ['Myofascial pain', 'Trigger point release', 'Chronic muscular tightness', 'Refractory soft-tissue pain', 'Enhanced rehabilitation response'],
        duration: '20–40 min', sessions: '1–6 sessions depending on response'
    },
    jointmob: {
        icon: '🔄', title: 'Joint Mobilisation & Soft Tissue',
        img: 'Joint-Mobilisation-Image.webp',
        intro: '',
        treats: ['Joint stiffness and hypomobility', 'Post-traumatic mobility loss', 'Soft tissue adhesions', 'Capsular restrictions', 'Pre- and post-operative mobilisation'],
        duration: '30–60 min', sessions: '3–8 sessions typically'
    }
};

function openServiceDetail(key) {
    const d = serviceData[key];
    if (!d) return;
    document.getElementById('serviceModalContent').innerHTML = `
        <div style="margin-bottom:1.5rem;overflow:hidden;border-radius:12px;height:220px;">
            <img src="${d.img}" alt="${d.title}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="font-size:2.2rem;margin-bottom:.6rem;">${d.icon}</div>
        <h2 style="margin-bottom:1rem;">${d.title}</h2>
        <p style="margin-bottom:1.5rem;line-height:1.8;">${d.intro}</p>
        <h4 style="color:var(--teal-dark);margin-bottom:.8rem;">Conditions &amp; Areas Treated</h4>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.5rem;">
            ${d.treats.map(t => `<li style="color:var(--grey);font-size:.92rem;padding-left:1rem;position:relative;">
                <span style="position:absolute;left:0;color:var(--lime-dark);font-weight:700;">✓</span> ${t}
            </li>`).join('')}
        </ul>
        <div style="display:flex;gap:1rem;margin-bottom:2rem;flex-wrap:wrap;">
            <div style="background:var(--teal-light);border-radius:10px;padding:.8rem 1.2rem;flex:1;min-width:140px;">
                <div style="font-size:.78rem;color:var(--teal);font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:.2rem;">Session Duration</div>
                <div style="font-weight:600;color:var(--dark);">${d.duration}</div>
            </div>
            <div style="background:var(--lime-light);border-radius:10px;padding:.8rem 1.2rem;flex:1;min-width:140px;">
                <div style="font-size:.78rem;color:var(--lime-dark);font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:.2rem;">Recommended</div>
                <div style="font-weight:600;color:var(--dark);">${d.sessions}</div>
            </div>
        </div>
        <button class="btn-primary full-width" onclick="closeServiceModal();openBooking();">Book This Service</button>`;
    openModal('serviceModal');
}

// ── SCROLL-TO-TOP ────────────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    if (scrollTopBtn) scrollTopBtn.style.display = window.pageYOffset > 400 ? 'block' : 'none';
});

// ── INIT ────────────────────────────────────────────────────
window.addEventListener('load', () => {
    showPage('home');
    setTimeout(revealItems, 200);
    setTimeout(animateCounters, 600);
});
window.addEventListener('scroll', revealItems);