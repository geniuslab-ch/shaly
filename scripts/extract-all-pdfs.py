#!/usr/bin/env python3
"""
Extract text from ALL blog article PDFs (articles 4-30)
"""
import os
import sys
import json
from datetime import datetime, timedelta

try:
    import PyPDF2
except ImportError:
    print("PyPDF2 already installed")
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

def extract_article_number(filename):
    """Extract article number from filename"""
    # Handle different formats: "Article 11_", "Article_15", "Article 04_"
    import re
    match = re.search(r'Article[\s_]+(\d+)', filename)
    if match:
        return int(match.group(1))
    return None

def main():
    blog_dir = "frontend/src/pages/Blog"
    pdf_files = [f for f in os.listdir(blog_dir) if f.endswith('.pdf')]
    
    # Base publication date: January 7, 2025 (article 1, which we'll skip)
    base_date = datetime(2025, 1, 7, 9, 0, 0)
    
    articles = []
    
    for pdf_file in sorted(pdf_files):
        article_num = extract_article_number(pdf_file)
        
        if article_num is None or article_num < 4:
            continue
            
        pdf_path = os.path.join(blog_dir, pdf_file)
        
        print(f"\nProcessing Article {article_num}: {pdf_file}")
        
        text = extract_pdf_text(pdf_path)
        if text:
            # Calculate publication date (7 days apart from article 1)
            days_offset = (article_num - 1) * 7
            pub_date = base_date + timedelta(days=days_offset)
            
            # Extract title from filename
            title = pdf_file.replace(f"Article {article_num:02d}_" if article_num < 10 else f"Article {article_num}_", "")
            title = title.replace(f"Article_{article_num}", "")
            title = title.replace(".pdf", "")
            title = title.replace("❌ ", "").replace("⏳ ", "").replace("🔐 ", "").replace("📊 ", "").replace("🚨 ", "").strip()
            
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
    with open('scripts/all_articles.json', 'w', encoding='utf-8') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Extracted {len(articles)} articles to scripts/all_articles.json")

if __name__ == "__main__":
    main()
