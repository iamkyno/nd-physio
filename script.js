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
function closeBooking()      { closeModal('bookingModal'); }
function closeSuccess()      { closeModal('successModal'); }
function closeTeamModal()    { closeModal('teamModal'); }
function closeServiceModal() { closeModal('serviceModal'); }

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
        role: 'Founder & Principal Physiotherapist',
        img: 'Noxolo-Duma-Image.jpg',
        qual: 'BPhysio (UKZN) - MPH (2019) - PhD Candidate (UKZN) - HPCSA Registered',
        tags: ['Neurological Rehab', 'Orthopaedics', 'Cardiothoracic', 'Public Health', 'Leadership'],
        bio: 'Noxolo Erica Duma is the Founder and Director of Noxolo Duma Physiotherapy. She holds a Bachelor of Physiotherapy from the University of KwaZulu-Natal and a Master of Public Health, completed in 2019 under the supervision of the late Professor TE Madiba.',
        bio2: 'She is currently completing her PhD under Professor KW Hlongwana and Dr NA Benjamin-Damons, reflecting her commitment to academic excellence and evidence-based practice. Her clinical experience spans ICU, orthopaedics, paediatrics, surgical and medical wards, amputation, neurology, cardiac rehab, and orthotics and prosthetics clinics.',
        specialties: [
            'Neurological rehabilitation',
            'Orthopaedic rehabilitation (total knee and hip replacements)',
            'Cardiothoracic rehabilitation',
            'Community-based care and health promotion',
            'Evidence-based practice and service delivery'
        ],
        extra: 'View full research profile: <a href="https://www.researchgate.net/profile/Noxolo_Duma2" target="_blank" style="color:var(--teal); font-weight:600;">ResearchGate -&gt;</a>'
    },
    silondile: {
        name: 'Silondile S. Nkala',
        role: 'Physiotherapist',
        img: 'Silondile.jpg',
        qual: 'BPhysio (UKZN) - MSc Physiotherapy Candidate (Wits)',
        tags: ['Patient-Centred Care', 'Holistic Rehab', 'Evidence-Based'],
        bio: 'Silondile Sibonile Nkala is a passionate and dedicated physiotherapist committed to delivering high-quality, patient-centred care. She holds a Bachelor of Physiotherapy from the University of KwaZulu-Natal and is currently registered for a Master of Physiotherapy at the University of the Witwatersrand.',
        bio2: 'Now in her fourth year of professional practice, she focuses on restoring function, mobility, and quality of life through a supportive and empowering treatment environment. She values the diversity of patient presentations and works to ensure each patient leaves with relief and measurable progress.',
        specialties: [
            'Personalised rehabilitation planning',
            'Mobility restoration and functional training',
            'Patient motivation and education',
            'Holistic, goal-aligned care'
        ]
    },
    nompumelelo: {
        name: 'Nompumelelo G. Geza',
        role: 'Practice Manager',
        img: 'Nompumelelo.jpg',
        qual: 'Business Administration - Nursing Diploma - ECD and Education Certificate',
        tags: ['Operations', 'Patient Care', 'Leadership'],
        bio: 'Nompumelelo Gracious Geza is an accomplished and compassionate Practice Manager with a multidisciplinary foundation in healthcare and administration. Her background blends clinical insight with operational leadership, ensuring the practice runs efficiently while staying patient-centred.',
        bio2: 'With qualifications in Business Administration, Early Childhood Development and Education, and Nursing, she creates a supportive environment for both patients and staff. She is driven by making a meaningful difference and takes pride in seeing patients recover and return with gratitude.',
        specialties: [
            'Practice operations and workflow',
            'Patient experience and support',
            'Team coordination and administration',
            'Clinical and operational leadership'
        ]
    },
    khanyiswa: {
        name: 'Khanyiswa M. Ndziweni',
        role: 'Administrator',
        img: 'Khanyiswa.jpg',
        qual: 'Computer Certificate - Aviation Certificate (Skyy Aviation Academy)',
        tags: ['Front Desk', 'Patient Support', 'Administration'],
        bio: 'Khanyiswa Miranda Ndziweni is a driven and hardworking medical secretary with strong communication skills and attention to detail. She plays a key role in day-to-day operations while creating a welcoming and professional environment for patients.',
        bio2: 'Her experience in customer engagement and her technical training allow her to provide efficient, reliable support to both patients and the team. Her ambition and versatility are reflected in her aviation studies and commitment to continuous growth.',
        specialties: [
            'Patient reception and coordination',
            'Administrative and technical support',
            'Communication and scheduling',
            'Customer engagement'
        ]
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
                <div class="tm-tags">${d.tags.map(t => `<span>${t}</span>`).join('')}</div>
            </div>
        </div>
        <div class="tm-body">
            <p>${d.bio}</p>
            <p>${d.bio2}</p>
            ${d.extra ? `<p style="margin-top:.5rem;">${d.extra}</p>` : ''}
            <h4 style="margin:1.5rem 0 .8rem;color:var(--teal-dark)">Areas of Specialisation</h4>
            <ul class="tm-list">${d.specialties.map(s => `<li>${s}</li>`).join('')}</ul>
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
        img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=320&fit=crop&q=80',
        intro: 'Our approach is grounded in the latest clinical research and interprofessional rehabilitation frameworks.',
        treats: ['Stroke', '⁠Traumatic brain injury', 'Balance and co-ordination disorders', 'Spinal cord injuries'],
        duration: '60 min', sessions: 'Long-term ongoing programme'
    },
    manual: {
        icon: '🤲', title: 'Manual Therapy',
        img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=320&fit=crop&q=80',
        intro: 'Hands-on physiotherapy using mobilisation, manipulation, and soft tissue techniques to reduce pain, restore joint mobility, and improve functional movement patterns.',
        treats: ['Acute and chronic back pain', 'Neck pain and stiffness', 'Headaches of cervical origin', 'Hip and shoulder conditions', 'Post-injury joint stiffness'],
        duration: '45–60 min', sessions: '4–8 sessions recommended'
    },
    preventive: {
        icon: '🛡️', title: 'Preventive Medicine & Health Promotion',
        img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=320&fit=crop&q=80',
        intro: 'Proactive physiotherapy programmes designed to prevent injury, reduce disability risk, and promote optimal health — tailored to your lifestyle, occupation, and individual health profile.',
        treats: ['Workplace ergonomic assessment', 'Injury prevention screening', 'Postural health programmes', 'Active ageing and fall prevention', 'Health education and lifestyle counselling'],
        duration: '45–60 min', sessions: 'Ongoing as needed'
    }
    ,
    ortho: {
        icon: '🦴', title: 'Orthopaedic Rehabilitation',
        img: 'Orthopaedic-Rehabilitation-Image.jpg',
        intro: 'Specialist rehabilitation following orthopaedic surgery and musculoskeletal injury — focused on restoring strength, mobility and return-to-function through progressive loading and tailored exercise.',
        treats: ['Total knee and hip replacement rehab', 'Post-operative mobilisation and strengthening', 'Soft-tissue injury rehab', 'Tendon and ligament recovery', 'Post-fracture rehabilitation'],
        duration: '45–60 min', sessions: '4–12 sessions (individualised)'
    },
    electro: {
        icon: '⚡', title: 'Electrotherapy',
        img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=320&fit=crop&q=80',
        intro: 'Targeted electrotherapy modalities to reduce pain, modulate neuromuscular activity and accelerate tissue healing as part of a broader physiotherapy plan.',
        treats: ['TENS for pain relief', 'Interferential therapy', 'Shockwave therapy', 'Neuromuscular stimulation', 'Post-operative analgesia support'],
        duration: '30–45 min', sessions: 'Often used adjunctively across course of care'
    },
    respiratory: {
        icon: '🫁', title: 'Respiratory Physiotherapy',
        img: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&h=320&fit=crop&q=80',
        intro: 'Assessment and treatment to improve ventilation, airway clearance and functional respiratory capacity — helpful for chronic and acute respiratory conditions.',
        treats: ['COPD management', 'Post-operative chest physiotherapy', 'Bronchiectasis and secretion clearance', 'Breathing retraining', 'Pulmonary rehabilitation'],
        duration: '45–60 min', sessions: 'Programme-based / ongoing'
    },
    dryneedling: {
        icon: '💉', title: 'Dry Needling (IMS)',
        img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=320&fit=crop&q=80',
        intro: 'Intramuscular stimulation (dry needling) to release myofascial trigger points, reduce pain and improve local tissue perfusion as part of an integrated treatment plan.',
        treats: ['Myofascial pain', 'Trigger point release', 'Chronic muscular tightness', 'Refractory soft-tissue pain', 'Enhanced rehabilitation response'],
        duration: '20–40 min', sessions: '1–6 sessions depending on response'
    },
    jointmob: {
        icon: '🔄', title: 'Joint Mobilisation & Soft Tissue',
        img: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=320&fit=crop&q=80',
        intro: 'Hands-on joint mobilisation and soft tissue techniques to improve range of motion, reduce stiffness and restore comfortable movement patterns.',
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