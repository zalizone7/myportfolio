import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def create_cv():
    pdf_path = os.path.join(os.path.dirname(__file__), "Ali_Mahmood_CV.pdf")
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=30,
        rightMargin=30,
        topMargin=26,
        bottomMargin=26
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#0284c7") # Modern vibrant blue
    dark_text = colors.HexColor("#0f172a") # Slate 900
    sub_text = colors.HexColor("#475569") # Slate 600
    bg_light = colors.HexColor("#f8fafc") # Slate 50
    border_color = colors.HexColor("#cbd5e1")
    
    name_style = ParagraphStyle(
        'NameStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=20,
        textColor=dark_text
    )
    
    tag_style = ParagraphStyle(
        'TagStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=primary_color
    )
    
    contact_style = ParagraphStyle(
        'ContactStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        alignment=2, # Right aligned
        textColor=sub_text
    )
    
    section_head_style = ParagraphStyle(
        'SectionHeadStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=dark_text,
        spaceBefore=5,
        spaceAfter=2
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1e293b")
    )
    
    job_title_style = ParagraphStyle(
        'JobTitleStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=dark_text
    )
    
    job_sub_style = ParagraphStyle(
        'JobSubStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=primary_color
    )
    
    date_style = ParagraphStyle(
        'DateStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        alignment=2,
        textColor=sub_text
    )
    
    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.5,
        leftIndent=12,
        firstLineIndent=-8,
        textColor=colors.HexColor("#334155")
    )

    story = []

    # 1. Header Table
    left_header = [
        Paragraph("<b>ALI MAHMOOD</b>", name_style),
        Spacer(1, 2),
        Paragraph("PYTHON DEVELOPER & ETHICAL HACKER", tag_style)
    ]
    
    right_contact = [
        Paragraph("<b>Email:</b> zalizone@gmail.com", contact_style),
        Paragraph("<b>WhatsApp:</b> +92 309 7413187", contact_style),
        Paragraph("<b>Fiverr:</b> fiverr.com/s/NNX7g1R", contact_style),
        Paragraph("<b>Location:</b> Pakistan (Available Globally / Remote)", contact_style)
    ]
    
    header_table = Table([[left_header, right_contact]], colWidths=[310, 212])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceBefore=2, spaceAfter=8))

    # 2. Professional Summary
    story.append(Paragraph("<b>// PROFESSIONAL SUMMARY</b>", section_head_style))
    summary_text = (
        "Security-centric <b>Python Developer</b> and <b>Penetration Tester</b> with 3+ years of coding experience and a 100% "
        "ethical track record. Proven expertise in automated vulnerability scanning, black-box web and network auditing, "
        "and full-stack web engineering. Creator of 15+ production projects, including AI vulnerability scanners and high-scale "
        "educational portals serving thousands of students across Pakistan."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 4))

    # 3. Core Technical Skills
    story.append(Paragraph("<b>// CORE TECHNICAL SKILLS</b>", section_head_style))
    skills_data = [
        [
            Paragraph("<b>Languages & Scripting:</b>", job_title_style),
            Paragraph("Python (Advanced), JavaScript, C++, Bash Scripting, HTML5/CSS3", body_style)
        ],
        [
            Paragraph("<b>Security & Pentesting:</b>", job_title_style),
            Paragraph("Web App Auditing (OWASP Top 10), Network Assessment, Vulnerability Analysis", body_style)
        ],
        [
            Paragraph("<b>Security Tooling:</b>", job_title_style),
            Paragraph("Nmap, OWASP ZAP, Metasploit Framework, Wireshark, Burp Suite, Kali Linux", body_style)
        ],
        [
            Paragraph("<b>Web & Frameworks:</b>", job_title_style),
            Paragraph("Next.js, React, Node.js, RESTful APIs, Git, GitHub, Linux Server Admin", body_style)
        ]
    ]
    skills_table = Table(skills_data, colWidths=[150, 372])
    skills_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 4))

    # 4. Featured Projects & Practical Audits
    story.append(Paragraph("<b>// FEATURED PROJECTS & PRACTICAL AUDITS</b>", section_head_style))
    
    # Project 1: VulnAI
    p1_head = Table([
        [Paragraph("<b>VulnAI – AI-Powered Vulnerability Scanner</b>", job_title_style),
         Paragraph("Lead Security Architect & Developer", date_style)]
    ], colWidths=[360, 162])
    p1_head.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0)]))
    story.append(p1_head)
    story.append(Paragraph("• Built an automated scanner combining <b>Nmap</b> & <b>OWASP ZAP</b> with Google Gemini AI for automated CVE discovery.", bullet_style))
    story.append(Paragraph("• Automated parsing of scan dumps into prioritized severity matrices with executive PDF audit remediation reports.", bullet_style))
    story.append(Spacer(1, 3))

    # Project 2: Medical Audit
    p2_head = Table([
        [Paragraph("<b>Medical Platform Security Audit</b>", job_title_style),
         Paragraph("Black-Box Penetration Tester", date_style)]
    ], colWidths=[360, 162])
    p2_head.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0)]))
    story.append(p2_head)
    story.append(Paragraph("• Executed a black-box penetration test against a live medical platform web app and host server infrastructure.", bullet_style))
    story.append(Paragraph("• Discovered critical Apache 2.2.8 and TLS 1.0 exposures, delivering comprehensive hardening guidelines (TLS 1.3 & HTTPS).", bullet_style))
    story.append(Spacer(1, 3))

    # Project 3: Pathora
    p3_head = Table([
        [Paragraph("<b>Pathora – Entry-Test Prep Ecosystem (pathoras.vercel.app)</b>", job_title_style),
         Paragraph("Full-Stack Web Architect", date_style)]
    ], colWidths=[360, 162])
    p3_head.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0)]))
    story.append(p3_head)
    story.append(Paragraph("• Architected a 100% free educational portal featuring 14 integrated tools serving thousands of Pakistani university candidates.", bullet_style))
    story.append(Paragraph("• Built AI mock test engines (NUST NET, FAST-NU, ECAT), aggregate merit calculator, and 188 universities comparison directory.", bullet_style))
    story.append(Spacer(1, 4))

    # Project 4: SukoonAI
    p4_head = Table([
        [Paragraph("<b>SukoonAI – Teen Mental Health &amp; Institutional Platform</b>", job_title_style),
         Paragraph("Full-Stack &amp; Security Architect", date_style)]
    ], colWidths=[360, 162])
    p4_head.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0)]))
    story.append(p4_head)
    story.append(Paragraph("• Engineered an empathetic teen AI companion with habit reformation challenges and <b>Zero-Knowledge client-side encrypted database storage</b>.", bullet_style))
    story.append(Paragraph("• Developed 4-tier institutional analytics for schools, enabling educators and leadership to monitor anonymous classroom mental wellness trends.", bullet_style))
    story.append(Spacer(1, 4))

    # 5. Certifications & Accreditations
    story.append(Paragraph("<b>// CERTIFICATIONS & RECOGNITIONS</b>", section_head_style))
    certs_data = [
        [
            Paragraph("• <b>Certificate of Appreciation:</b> Medix Prep Point (Website Security & Maintenance)", body_style),
            Paragraph("• <b>Certified Ethical Hacker (CEH):</b> Principles & Methodologies", body_style)
        ],
        [
            Paragraph("• <b>CompTIA Security+:</b> Network Defense & Threat Analysis", body_style),
            Paragraph("• <b>eLearnSecurity Junior Penetration Tester (eJPT):</b> Fundamentals", body_style)
        ]
    ]
    certs_table = Table(certs_data, colWidths=[260, 262])
    certs_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 1),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(certs_table)
    story.append(Spacer(1, 4))

    # 6. Key Achievements
    story.append(Paragraph("<b>// KEY ACHIEVEMENTS</b>", section_head_style))
    story.append(Paragraph("• <b>15+ Production Deliveries:</b> Shipped custom web applications, Python automation bots, and cybersecurity tools.", bullet_style))
    story.append(Paragraph("• <b>5+ CTF Competitions:</b> Solved challenges spanning cryptography, web exploitation, and reverse engineering.", bullet_style))
    story.append(Paragraph("• <b>100% Ethical Stance:</b> Dedicated to defensive security posture, secure software development, and responsible disclosure.", bullet_style))

    doc.build(story)
    print("CV PDF created successfully:", pdf_path)

if __name__ == "__main__":
    create_cv()
