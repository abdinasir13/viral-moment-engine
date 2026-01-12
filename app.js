const { useState, useEffect } = React;

// Icon Components (inline SVG)
const Film = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18M3 7.5h4M3 12h18M3 16.5h4M17 3v18M17 7.5h4M17 16.5h4"/></svg>;
const TrendingUp = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const Zap = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const FileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const Clock = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Sparkles = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const Star = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const Eye = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const Brain = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;

// Storage helper
const storage = {
    get: async (key) => {
        const value = localStorage.getItem(key);
        return value ? { key, value } : null;
    },
    set: async (key, value) => {
        localStorage.setItem(key, value);
        return { key, value };
    }
};

const ViralMomentEngine = () => {
    const [activeTab, setActiveTab] = useState('discovery');
    const [trendingContent, setTrendingContent] = useState([]);
    const [selectedMoments, setSelectedMoments] = useState([]);
    const [scripts, setScripts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const apiKey = 'bfd1019eae4067e32083fd47a9b16de9';

    useEffect(() => {
        loadStoredData();
    }, []);

    const loadStoredData = async () => {
        try {
            const scriptsData = await storage.get('generated-scripts');
            const momentsData = await storage.get('viral-moments');
            if (scriptsData) setScripts(JSON.parse(scriptsData.value));
            if (momentsData) setSelectedMoments(JSON.parse(momentsData.value));
        } catch (error) {
            console.log('No stored data found');
        }
    };

    const saveScripts = async (newScripts) => {
        await storage.set('generated-scripts', JSON.stringify(newScripts));
    };

    const saveMoments = async (newMoments) => {
        await storage.set('viral-moments', JSON.stringify(newMoments));
    };

    const fetchTrendingContent = async () => {
        setIsLoading(true);
        try {
            const [moviesRes, tvRes] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`),
                fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`)
            ]);
            const moviesData = await moviesRes.json();
            const tvData = await tvRes.json();
            const allContent = [
                ...moviesData.results.map(item => ({ ...item, type: 'movie' })),
                ...tvData.results.map(item => ({ ...item, type: 'tv' }))
            ];
            const scoredContent = allContent.map(item => {
                const popularityScore = item.popularity / 100;
                const voteScore = item.vote_average / 10;
                const releaseDate = new Date(item.release_date || item.first_air_date);
                const recencyScore = releaseDate > new Date('2020-01-01') ? 1.5 : 1;
                const viralityScore = (popularityScore * 0.4 + voteScore * 0.3 + recencyScore * 0.3);
                return { ...item, viralityScore: viralityScore.toFixed(2) };
            });
            setTrendingContent(scoredContent.sort((a, b) => b.viralityScore - a.viralityScore).slice(0, 20));
        } catch (error) {
            alert('Error fetching content');
        } finally {
            setIsLoading(false);
        }
    };

    const identifyViralMoments = async (content) => {
        setIsLoading(true);
        const genres = content.genre_ids || [];
        const templates = {
            action: [
                { title: "The Opening Statement", timestamp: "00:08:30", type: "spectacle", description: "High-octane action sequence that sets the tone" },
                { title: "The Impossible Stunt", timestamp: "00:45:15", type: "spectacle", description: "Physics-defying moment that goes viral" },
                { title: "The One-Liner", timestamp: "01:12:00", type: "quotable", description: "Memorable catchphrase or comeback" },
                { title: "The Final Showdown", timestamp: "01:45:30", type: "climax", description: "Epic confrontation scene" },
                { title: "The Plot Twist", timestamp: "01:20:00", type: "shock", description: "Unexpected revelation" }
            ],
            comedy: [
                { title: "The Awkward Moment", timestamp: "00:15:20", type: "cringe", description: "Uncomfortable but hilarious situation" },
                { title: "The Reaction Shot", timestamp: "00:32:45", type: "meme", description: "Perfect facial expression for memes" },
                { title: "The Callback Joke", timestamp: "01:05:10", type: "quotable", description: "Payoff to earlier setup" },
                { title: "The Improvised Line", timestamp: "00:48:30", type: "quotable", description: "Ad-libbed moment" },
                { title: "The Physical Comedy", timestamp: "01:15:00", type: "spectacle", description: "Slapstick or visual gag" }
            ],
            drama: [
                { title: "The Emotional Breakdown", timestamp: "01:08:45", type: "emotional", description: "Raw, vulnerable character moment" },
                { title: "The Confrontation", timestamp: "00:52:30", type: "tension", description: "Heated argument or revelation" },
                { title: "The Monologue", timestamp: "01:25:00", type: "quotable", description: "Powerful speech" },
                { title: "The Silent Moment", timestamp: "01:35:20", type: "artistic", description: "Wordless powerful scene" },
                { title: "The Choice", timestamp: "01:42:15", type: "climax", description: "Life-changing decision" }
            ]
        };
        let selectedTemplate = templates.drama;
        if (genres.includes(28)) selectedTemplate = templates.action;
        else if (genres.includes(35)) selectedTemplate = templates.comedy;
        
        const moments = selectedTemplate.map((moment, idx) => ({
            id: `${content.id}-${idx}`,
            contentTitle: content.title || content.name,
            contentType: content.type,
            posterPath: content.poster_path,
            ...moment,
            viralReason: `Viral-worthy ${moment.type} moment with high engagement potential`,
            audienceAppeal: "General audience + social media users",
            clipability: "High",
            rating: content.vote_average
        }));
        
        const updatedMoments = [...selectedMoments, ...moments];
        setSelectedMoments(updatedMoments);
        await saveMoments(updatedMoments);
        setIsLoading(false);
        setActiveTab('moments');
    };

    const generateScript = async (moment) => {
        const script = {
            hook: `Ever notice how ${moment.contentTitle} breaks every rule in the book?`,
            setup: `In ${moment.contentTitle}, we have ${moment.description.toLowerCase()}. On the surface, it's just another ${moment.type} moment. But look closer.`,
            analysis: `This moment works because it trusts the audience. The cinematography, the timing, the performance - everything converges to create something memorable. This is filmmaking at its finest.`,
            cta: `What do you think? Did the filmmakers nail this moment? Drop your take in the comments.`,
            keyVisuals: [`Show moment at ${moment.timestamp}`, `Zoom on key detail`, `Cut to wider shot`, `Return to close-up`],
            captionHighlights: [`"${moment.title}"`, `Rated ${moment.rating}/10`, `#FilmAnalysis`]
        };
        const fullScript = {
            id: `script-${Date.now()}`,
            moment,
            script,
            createdAt: new Date().toISOString(),
            status: 'ready'
        };
        const updatedScripts = [...scripts, fullScript];
        setScripts(updatedScripts);
        await saveScripts(updatedScripts);
        setActiveTab('scripts');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto p-6">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <div className="relative">
                            <div className="w-12 h-12 text-purple-400"><Film /></div>
                            <div className="w-5 h-5 text-pink-400 absolute -top-1 -right-1 animate-pulse"><Sparkles /></div>
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2">
                        Viral Moment Engine
                    </h1>
                    <p className="text-gray-400 text-lg">AI-Powered Content Discovery & Script Generation</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                                <TrendingUp />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{trendingContent.length}</div>
                                <div className="text-sm text-gray-400">Trending Items</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400">
                                <Zap />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{selectedMoments.length}</div>
                                <div className="text-sm text-gray-400">Viral Moments</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                                <FileText />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{scripts.length}</div>
                                <div className="text-sm text-gray-400">Scripts Ready</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 mb-8">
                    <div className="grid grid-cols-3 gap-2">
                        {['discovery', 'moments', 'scripts'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                    activeTab === tab ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}>
                                {tab === 'discovery' && <><TrendingUp /> Discovery</>}
                                {tab === 'moments' && <><Zap /> Moments ({selectedMoments.length})</>}
                                {tab === 'scripts' && <><FileText /> Scripts ({scripts.length})</>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                    {activeTab === 'discovery' && (
                        <div className="space-y-6">
                            <button onClick={fetchTrendingContent} disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                {isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Loading...</> : <><Sparkles /> Discover Trending Content</>}
                            </button>
                            {trendingContent.length > 0 && trendingContent.map(item => (
                                <div key={item.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                                    <div className="flex gap-6">
                                        {item.poster_path && (
                                            <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name} 
                                                className="w-32 h-48 object-cover rounded-xl" />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-3">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white">{item.title || item.name}</h3>
                                                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm uppercase">{item.type}</span>
                                                </div>
                                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl font-bold">{item.viralityScore}</div>
                                            </div>
                                            <p className="text-gray-300 text-sm mb-4">{item.overview}</p>
                                            <div className="flex gap-4 mb-4 text-sm">
                                                <span className="flex items-center gap-1 text-yellow-400"><Star />{item.vote_average.toFixed(1)}</span>
                                                <span className="flex items-center gap-1 text-orange-400"><Eye />{Math.round(item.popularity)}</span>
                                            </div>
                                            <button onClick={() => identifyViralMoments(item)} disabled={isLoading}
                                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                                                <Zap className="inline w-4 h-4 mr-2" /> Identify Viral Moments
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'moments' && (
                        <div className="space-y-6">
                            {selectedMoments.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto mb-4 text-purple-400/50"><Brain /></div>
                                    <p className="text-gray-400 text-lg">No moments identified yet</p>
                                </div>
                            ) : selectedMoments.map(moment => (
                                <div key={moment.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                                    <div className="flex justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{moment.title}</h3>
                                            <p className="text-purple-400">{moment.contentTitle}</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-xl">
                                            <Clock className="w-4 h-4 text-cyan-400" />
                                            <span className="text-white font-mono">{moment.timestamp}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-4">{moment.description}</p>
                                    <div className="bg-yellow-500/10 border-l-4 border-yellow-500 rounded-lg p-4 mb-4">
                                        <p className="text-sm font-semibold text-yellow-400">Viral Factor</p>
                                        <p className="text-sm text-gray-300">{moment.viralReason}</p>
                                    </div>
                                    <button onClick={() => generateScript(moment)}
                                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                                        <FileText className="inline w-4 h-4 mr-2" /> Generate Commentary Script
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'scripts' && (
                        <div className="space-y-6">
                            {scripts.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto mb-4 text-pink-400/50"><FileText /></div>
                                    <p className="text-gray-400 text-lg">No scripts generated yet</p>
                                </div>
                            ) : scripts.map(item => (
                                <div key={item.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                                    <div className="flex justify-between mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{item.moment.title}</h3>
                                            <p className="text-purple-400">{item.moment.contentTitle}</p>
                                        </div>
                                        <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-xl font-bold">● Ready</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-red-500/10 border-l-4 border-red-500 rounded-lg p-4">
                                            <p className="text-xs font-bold text-red-400 mb-2 uppercase">Hook (0-3s)</p>
                                            <p className="text-white">{item.script.hook}</p>
                                        </div>
                                        <div className="bg-blue-500/10 border-l-4 border-blue-500 rounded-lg p-4">
                                            <p className="text-xs font-bold text-blue-400 mb-2 uppercase">Setup (3-8s)</p>
                                            <p className="text-white">{item.script.setup}</p>
                                        </div>
                                        <div className="bg-purple-500/10 border-l-4 border-purple-500 rounded-lg p-4">
                                            <p className="text-xs font-bold text-purple-400 mb-2 uppercase">Analysis (8-45s)</p>
                                            <p className="text-white">{item.script.analysis}</p>
                                        </div>
                                        <div className="bg-green-500/10 border-l-4 border-green-500 rounded-lg p-4">
                                            <p className="text-xs font-bold text-green-400 mb-2 uppercase">CTA (45-50s)</p>
                                            <p className="text-white">{item.script.cta}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {isLoading && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-slate-800 border border-purple-500/50 rounded-2xl p-8 shadow-2xl">
                            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white font-semibold text-lg">Processing...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ViralMomentEngine />);
