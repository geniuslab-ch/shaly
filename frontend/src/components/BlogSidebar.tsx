interface BlogSidebarProps {
    categories: Array<{ id: number; name: string; slug: string; }>;
    selectedCategory: string | null;
    onSelectCategory: (slug: string | null) => void;
    postCounts?: Record<string, number>;
}

export default function BlogSidebar({ categories, selectedCategory, onSelectCategory, postCounts = {} }: BlogSidebarProps) {
    return (
        <aside className="space-y-6">
            {/* Categories */}
            <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Catégories
                </h3>

                <div className="space-y-2">
                    {/* All Categories */}
                    <button
                        onClick={() => onSelectCategory(null)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all ${selectedCategory === null
                                ? 'bg-linkedin-500 text-white'
                                : 'hover:bg-white/5 text-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span>Tous les articles</span>
                            {postCounts['all'] && (
                                <span className="text-sm opacity-75">
                                    {postCounts['all']}
                                </span>
                            )}
                        </div>
                    </button>

                    {/* Category List */}
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.slug)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-all ${selectedCategory === category.slug
                                    ? 'bg-linkedin-500 text-white'
                                    : 'hover:bg-white/5 text-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{category.name}</span>
                                {postCounts[category.slug] && (
                                    <span className="text-sm opacity-75">
                                        {postCounts[category.slug]}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Box */}
            <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Recherche
                </h3>
                <input
                    type="text"
                    placeholder="Rechercher un article..."
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-linkedin-500 transition-colors"
                />
            </div>
        </aside>
    );
}
