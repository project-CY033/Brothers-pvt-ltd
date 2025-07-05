document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle animation
    const particleSystem = new ParticleSystem();
    
    // Lazy load elements with AOS effect
    initAOS();
    
    // Initialize tabs
    initTabs();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize modal functionality
    initModals();
    
    // Initialize header scroll effect
    initHeaderScroll();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize chatbot
    initChatbot();
    
    // Initialize notification system
    initNotifications();
    initNotificationsSection();
    
    initCustomCursor();
});

// AOS (Animate on Scroll) implementation
function initAOS() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

// Tabs functionality
function initTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header, .auth-tab');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            const tabContainer = this.closest('.hire-tabs, .auth-tabs').parentElement;
            
            // Deactivate all tabs and panels
            tabContainer.querySelectorAll('.tab-header, .auth-tab').forEach(item => {
                item.classList.remove('active');
            });
            
            tabContainer.querySelectorAll('.tab-panel, .auth-form').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Activate clicked tab and corresponding panel
            this.classList.add('active');
            
            if (tabContainer.querySelector('.hire-tabs')) {
                document.getElementById(`${tabName}-panel`).classList.add('active');
            } else {
                tabContainer.querySelector(`#${tabName}Form`).classList.add('active');
            }
        });
    });
}

// Testimonial slider
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!track) return;
    
    let currentIndex = 0;
    
    function updateSlider() {
        const slideWidth = slides[0].offsetWidth;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    });
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });
    
    // Auto slide every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }, 5000);
}

// Modal functionality
function initModals() {
    const openModalButtons = document.querySelectorAll('.login-btn, .register-btn');
    const modal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (!modal) return;
    
    openModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // If register button is clicked, show signup tab
            if (this.classList.contains('register-btn')) {
                document.querySelector('[data-tab="signup"]').click();
            }
        });
    });
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const navButtons = document.querySelector('.nav-buttons');
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            // Create mobile menu if it doesn't exist
            let mobileMenu = document.querySelector('.mobile-nav');
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-nav';
                mobileMenu.innerHTML = `
                    <ul class="nav-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#hire">Hire</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <div class="nav-buttons">
                        <button class="login-btn">Login</button>
                        <button class="register-btn">Register</button>
                    </div>
                `;
                document.body.appendChild(mobileMenu);
                
                // Add event listeners to mobile menu items
                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        closeMobileMenu();
                    });
                });
                
                // Add event listeners to buttons
                mobileMenu.querySelectorAll('button').forEach(button => {
                    button.addEventListener('click', function() {
                        closeMobileMenu();
                        
                        // If login or register button, open the modal
                        if (this.classList.contains('login-btn') || this.classList.contains('register-btn')) {
                            setTimeout(() => {
                                document.querySelector(`.${this.className}`).click();
                            }, 300);
                        }
                    });
                });
            }
            
            // Show mobile menu with animation
            setTimeout(() => {
                document.querySelector('.mobile-nav').classList.add('active');
            }, 10);
            
            // Disable scrolling
            document.body.style.overflow = 'hidden';
        } else {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-nav');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            
            // Enable scrolling
            document.body.style.overflow = 'auto';
            
            // Reset button state
            document.querySelector('.mobile-menu-btn').classList.remove('active');
        }
    }
    
    // Scroll to section when nav link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

// Handle form submissions
document.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Display success message
    const form = e.target;
    const formElements = form.elements;
    
    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        if (element.type !== 'submit' && element.type !== 'button') {
            element.value = '';
            if (element.tagName === 'SELECT') {
                element.selectedIndex = 0;
            }
        }
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    
    if (form.id === 'contactForm') {
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        form.parentNode.appendChild(successMessage);
    } else if (form.id === 'loginForm') {
        successMessage.textContent = 'Login successful!';
        form.appendChild(successMessage);
    } else if (form.id === 'signupForm') {
        successMessage.textContent = 'Registration successful! Please check your email to verify your account.';
        form.appendChild(successMessage);
    }
    
    // Remove message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
        
        // Close modal if it's a login/signup form
        if (form.id === 'loginForm' || form.id === 'signupForm') {
            document.querySelector('.close-modal').click();
        }
    }, 3000);
});

// Chatbot functionality
function initChatbot() {
    const chatBtn = document.querySelector('.floating-chat-btn');
    const chatContainer = document.querySelector('.chatbot-container');
    const closeBtn = document.querySelector('.chatbot-close');
    const messagesContainer = document.querySelector('.chatbot-messages');
    const inputField = document.getElementById('chatbot-input-field');
    const sendBtn = document.getElementById('chatbot-send-btn');
    
    // Chatbot knowledge base
    const chatbotData = {
        greetings: [
            "Hello! Welcome to Brothers Pvt Ltd. How can I assist you today?",
            "Hi there! I'm the Brothers Assistant. What can I help you with?",
            "Welcome to Brothers Pvt Ltd! I'm here to answer your questions."
        ],
        services: {
            "web development": "Our Web Development services include custom websites, web applications, e-commerce platforms, and CMS development using the latest technologies like React, Angular, Node.js, and more.",
            "app development": "We build mobile applications for iOS and Android platforms using native development or cross-platform frameworks like Flutter and React Native. Our team ensures your app is responsive, secure, and user-friendly.",
            "software testing": "Our Software Testing services include both manual and automated testing to ensure your software works flawlessly. We perform functional testing, regression testing, performance testing, and security testing.",
            "ethical hacking": "Our Ethical Hacking services help identify vulnerabilities in your systems before malicious hackers can exploit them. We conduct thorough penetration testing and provide detailed reports with remediation steps.",
            "penetration testing": "We offer comprehensive Penetration Testing services to identify security vulnerabilities in your networks, applications, and systems, helping you strengthen your security posture.",
            "cybersecurity": "Our Cybersecurity services include threat detection, incident response, security assessments, and implementation of robust security measures to protect your digital assets.",
            "cybersecurity tool development": "We develop custom cybersecurity tools tailored to your specific needs, including vulnerability scanners, intrusion detection systems, and security monitoring tools.",
            "threat intelligence": "Our Threat Intelligence services provide you with actionable insights about potential threats to your organization, helping you stay one step ahead of cyber attackers.",
            "research": "We conduct thorough research in various technology domains to help you make informed decisions and stay at the forefront of innovation.",
            "web security": "Our Web Security Audits identify vulnerabilities in your web applications and provide recommendations to enhance your security posture.",
            "ui/ux design": "Our UI/UX Design services focus on creating intuitive, user-friendly interfaces that enhance user experience and drive engagement with your digital products.",
            "graphical designing": "We offer Graphical Designing services including logo design, branding materials, marketing collateral, and visual assets for your digital presence.",
            "video editing": "Our Video Editing services transform raw footage into polished, professional videos for marketing, training, or entertainment purposes.",
            "content writing": "Our Content Writing services deliver engaging, SEO-optimized content that resonates with your target audience and drives traffic to your digital platforms.",
            "copywriting": "We craft compelling copy that converts visitors into customers, enhancing your brand message and driving business growth.",
            "social media marketing": "Our Social Media Marketing services help you build a strong online presence, engage with your audience, and drive business growth through strategic social media campaigns.",
            "seo": "We implement proven SEO strategies to improve your website's visibility in search engines, driving organic traffic and improving your online presence.",
            "courses": "We offer Educational Courses and Workshops on various technical subjects, helping individuals and teams upgrade their skills in areas like cybersecurity, coding, and digital marketing.",
            "technological assistance": "Our Technological Assistance services provide startups and businesses with the guidance and support they need to leverage technology effectively for growth and innovation.",
            "digital content creation": "We create engaging digital content including reels, shorts, infographics, and other multimedia formats to help you connect with your audience.",
            "ai solutions": "Our AI-based Solution Design & Integration services help businesses leverage artificial intelligence to automate processes, gain insights, and drive innovation.",
            "tool development": "We develop custom tools and scripts using Python, Shell, and other technologies to automate tasks and improve efficiency in your organization.",
            "resume building": "Our Resume Building services help job seekers create professional, tailored resumes that stand out to employers and highlight their skills and experience.",
            "career guidance": "We provide Career Guidance to help individuals navigate their professional paths, identify opportunities, and achieve their career goals.",
            "product selling": "Our Product & Software Selling Portal connects vendors with customers, providing a platform for buying and selling digital products and software solutions.",
            "cloud services": "We offer Cloud Services including cloud migration, management, optimization, and security to help businesses leverage the full potential of cloud computing.",
            "hosting": "Our Hosting Assistance services help you choose and set up the right hosting solution for your web applications, ensuring reliability, security, and performance.",
            "devops": "Our DevOps services streamline your development and operations processes, improving efficiency, reliability, and speed of software delivery.",
            "company registration": "We assist with Company Registration processes, helping new businesses navigate legal requirements and establish their formal business entity.",
            "hiring dashboard": "Our Hiring Dashboard for HR simplifies the recruitment process, helping companies find, evaluate, and onboard the right talent efficiently.",
            "freelancer marketplace": "Our Freelancer Marketplace Integration connects businesses with skilled freelancers across various domains, similar to platforms like Fiverr and Upwork."
        },
        faqs: {
            "pricing": "Our pricing varies based on the service and project requirements. For a detailed quote, please contact our sales team through the Contact Us form.",
            "timeline": "Project timelines depend on the scope and complexity. We provide estimated timelines during the initial consultation and keep you updated throughout the project.",
            "process": "Our process typically includes discovery, planning, execution, testing, and deployment phases. We maintain clear communication and regular updates throughout.",
            "payment": "We accept payments through various methods including credit/debit cards, bank transfers, and digital payment platforms. We typically require an advance payment to initiate projects.",
            "support": "Yes, we provide ongoing support and maintenance for all our services. Support packages can be customized based on your needs.",
            "team": "Our team consists of experienced professionals in various technology domains, including developers, designers, security experts, and content creators.",
            "hire developer": "To hire a developer, you can register as a company and post your requirements through our 'Hire' section. We'll match you with suitable candidates.",
            "contact": "You can reach us through the Contact Us form, email at info@brotherspvtltd.com, or call us at +1 (555) 123-4567."
        },
        unknown: [
            "I'm not sure I understand. Could you please rephrase your question?",
            "I don't have information on that topic yet. Please try asking about our services or general inquiries.",
            "I'm still learning! That question is a bit outside my knowledge base. Can I help you with something else?"
        ]
    };
    
    // Common questions for quick selection
    const commonQuestions = [
        "What services do you offer?",
        "How can I hire a developer?",
        "What is your pricing model?",
        "How long do projects take?",
        "Do you provide ongoing support?"
    ];
    
    // Open/close chatbot
    chatBtn.addEventListener('click', () => {
        chatContainer.classList.add('active');
        
        // Show welcome message if this is the first time opening
        if (messagesContainer.children.length === 0) {
            const greeting = chatbotData.greetings[Math.floor(Math.random() * chatbotData.greetings.length)];
            addBotMessage(greeting);
            
            // Add common questions as options
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'chat-options';
            
            commonQuestions.forEach(question => {
                const option = document.createElement('div');
                option.className = 'chat-option';
                option.textContent = question;
                option.addEventListener('click', () => {
                    handleUserInput(question);
                });
                optionsDiv.appendChild(option);
            });
            
            messagesContainer.lastElementChild.appendChild(optionsDiv);
        }
    });
    
    closeBtn.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });
    
    // Send message functionality
    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const userInput = inputField.value.trim();
        if (userInput) {
            handleUserInput(userInput);
            inputField.value = '';
        }
    }
    
    function handleUserInput(input) {
        // Display user message
        addUserMessage(input);
        
        // Process and respond to user input
        setTimeout(() => {
            const response = generateResponse(input);
            addBotMessage(response);
            
            // Scroll to the bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500);
    }
    
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user-message';
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to the bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot-message';
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to the bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function generateResponse(input) {
        input = input.toLowerCase();
        
        // Check if it's a service-related question
        for (const [key, value] of Object.entries(chatbotData.services)) {
            if (input.includes(key)) {
                return value;
            }
        }
        
        // Check FAQs
        if (input.includes("price") || input.includes("cost") || input.includes("fee")) {
            return chatbotData.faqs.pricing;
        } else if (input.includes("time") || input.includes("long") || input.includes("duration")) {
            return chatbotData.faqs.timeline;
        } else if (input.includes("process") || input.includes("work") || input.includes("how do you")) {
            return chatbotData.faqs.process;
        } else if (input.includes("payment") || input.includes("pay") || input.includes("billing")) {
            return chatbotData.faqs.payment;
        } else if (input.includes("support") || input.includes("maintenance") || input.includes("help")) {
            return chatbotData.faqs.support;
        } else if (input.includes("team") || input.includes("staff") || input.includes("expert")) {
            return chatbotData.faqs.team;
        } else if (input.includes("hire") || input.includes("recruit") || input.includes("employ")) {
            return chatbotData.faqs.hire_developer;
        } else if (input.includes("contact") || input.includes("reach") || input.includes("call")) {
            return chatbotData.faqs.contact;
        } else if (input.includes("service") || input.includes("offer") || input.includes("provide")) {
            return "We offer a wide range of services including Web & App Development, Cybersecurity Solutions, UI/UX Design, Content Creation, AI Solutions, and much more. What specific service are you interested in?";
        }
        
        // Unknown query response
        return chatbotData.unknown[Math.floor(Math.random() * chatbotData.unknown.length)];
    }
    
    // Close chatbot when clicking outside
    document.addEventListener('click', (event) => {
        const isChatbotClick = chatContainer.contains(event.target) || 
                               chatBtn.contains(event.target);
        
        if (!isChatbotClick && chatContainer.classList.contains('active')) {
            chatContainer.classList.remove('active');
        }
    });

    // Responsive chatbot sizing
    function adjustChatbotSize() {
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 576) {
            // Mobile view
            chatContainer.style.width = 'calc(100% - 2rem)';
            chatContainer.style.height = '80vh';
            chatContainer.style.right = '1rem';
            chatContainer.style.bottom = '1rem';
        } else if (screenWidth <= 992) {
            // Tablet view
            chatContainer.style.width = '400px';
            chatContainer.style.height = '500px';
            chatContainer.style.right = '2rem';
            chatContainer.style.bottom = '5rem';
        } else {
            // Desktop view
            chatContainer.style.width = '350px';
            chatContainer.style.height = '500px';
            chatContainer.style.right = '2rem';
            chatContainer.style.bottom = '5rem';
        }
    }

    // Initial sizing
    adjustChatbotSize();

    // Adjust size on window resize
    window.addEventListener('resize', adjustChatbotSize);
}

// Initialize notification system
function initNotifications() {
    // Removed the notification container and pop-up creation
    // This function is now a no-op
}

function initNotificationsSection() {
    const filters = document.querySelectorAll('.notification-filters .filter');
    const notificationCards = document.querySelectorAll('.notification-card');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active from all filters
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            const filterType = filter.getAttribute('data-filter');

            notificationCards.forEach(card => {
                if (filterType === 'all') {
                    card.style.display = 'flex';
                } else {
                    const cardType = card.classList.contains(`${filterType}-update`);
                    card.style.display = cardType ? 'flex' : 'none';
                }
            });
        });
    });

    // View All Notifications button
    const viewAllBtn = document.querySelector('.notification-actions .secondary-btn');
    viewAllBtn.addEventListener('click', () => {
        // You can add functionality like opening a full notifications page or modal
        alert('Full notifications view coming soon!');
    });
}

function initCustomCursor() {
    document.body.style.cursor = 'default';

    function addPointerCursor() {
        const interactiveElements = document.querySelectorAll(
            'a, button, .service-card, .talent-card, .blog-card, ' +
            '.social-icon, .modal-content, .chatbot-container, ' +
            '.nav-links a, .testimonial-card, .footer-social a'
        );
        
        interactiveElements.forEach(el => {
            el.style.cursor = 'pointer';
        });
    }

    const existingCursorElements = document.querySelectorAll(
        '.custom-cursor, .custom-cursor-follower, .cursor-trail'
    );
    existingCursorElements.forEach(el => el.remove());

    addPointerCursor();

    const observer = new MutationObserver(addPointerCursor);
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
}