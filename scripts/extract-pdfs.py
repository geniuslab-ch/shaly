#!/usr/bin/env python3
"""
Extract text from blog article PDFs and prepare for import
"""
import os
import sys
import json
from datetime import datetime, timedelta

try:
    import PyPDF2
except ImportError:
    print("Installing PyPDF2...")
    os.system("pip3 install PyPDF2")
    import PyPDF2

def extract_pdf_text(pdf_path):
    """Extract text from PDF file"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        print(f"Error extracting {pdf_path}: {e}")
        return None

def main():
    blog_dir = "frontend/src/pages/Blog"
    pdf_files = sorted([f for f in os.listdir(blog_dir) if f.endswith('.pdf')])
    
    # Base publication date: January 28, 2025 (article 4)
    base_date = datetime(2025, 1, 28, 9, 0, 0)
    
    articles = []
    
    for idx, pdf_file in enumerate(pdf_files):
        article_num = idx + 4  # Starting from article 4
        pdf_path = os.path.join(blog_dir, pdf_file)
        
        print(f"\nProcessing Article {article_num}: {pdf_file}")
        
        text = extract_pdf_text(pdf_path)
        if text:
            # Calculate publication date (7 days apart)
            pub_date = base_date + timedelta(days=idx * 7)
            
            # Extract title from filename (remove "Article XX_" prefix)
            title = pdf_file.replace(f"Article 0{article_num}_" if article_num < 10 else f"Article {article_num}_", "").replace(".pdf", "")
            title = title.replace("❌ ", "").replace("⏳ ", "").strip()
            
            article = {
                "number": article_num,
                "title": title,
                "filename": pdf_file,
                "content_preview": text[:500],
                "full_content": text,
                "publication_date": pub_date.isoformat() + "Z"
            }
            
            articles.append(article)
            print(f"  ✅ Extracted {len(text)} characters")
            print(f"  📅 Publication: {pub_date.strftime('%Y-%m-%d')}")
    
    # Save to JSON for processing
    with open('scripts/extracted_articles.json', 'w', encoding='utf-8') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Extracted {len(articles)} articles to scripts/extracted_articles.json")

if __name__ == "__main__":
    main()
