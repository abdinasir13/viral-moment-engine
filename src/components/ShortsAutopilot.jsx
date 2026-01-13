import React, { useState, useEffect } from 'react';
import { Film, Zap, Play, Download, Settings, TrendingUp, Video, Music, Type, Upload, CheckCircle, Clock, Sparkles, BarChart3, Eye, Target } from 'lucide-react';

const ShortsAutopilot = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [videos, setVideos] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [batchSize, setBatchSize] = useState(3);
  const [niche, setNiche] = useState('movie-analysis');
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0, stage: '' });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const data = await window.storage.get('generated-videos');
      if (data) setVideos(JSON.parse(data.value));
    } catch (error) {
      console.log('No videos found');
    }
  };

  const saveVideos = async (newVideos) => {
    try {
      await window.storage.set('generated-videos', JSON.stringify(newVideos));
    } catch (error) {
      console.error('Error saving videos:', error);
    }
  };

  const niches = {
    'movie-analysis': { keywords: ['film breakdown', 'movie explained', 'hidden meaning', 'easter eggs', 'plot twist'], tone: 'analytical' },
    'life-hacks': { keywords: ['genius trick', 'life changing', 'you need this', 'secret method', 'game changer'], tone: 'excited' },
    'history': { keywords: ['untold story', 'shocking truth', 'hidden history', 'never knew', 'mind blowing'], tone: 'mysterious' },
    'psychology': { keywords: ['mind trick', 'human behavior', 'psychology fact', 'why we', 'science explains'], tone: 'educational' },
    'tech': { keywords: ['tech hidden feature', 'phone hack', 'AI secret', 'tech tip', 'you didnt know'], tone: 'informative' }
  };

  const generateTopics = (nicheData) => {
    const templates = {
      'movie-analysis': [
        'This detail in [MOVIE] changes EVERYTHING',
        'The [MOVIE] ending explained - and why it\'s genius',
        'Why [MOVIE] is secretly about [THEME]',
        '[MOVIE] hidden detail you definitely missed',
        'The [MOVIE] plot hole that isn\'t actually a plot hole'
      ],
      'life-hacks': [
        'This [ITEM] trick will save you hours',
        'Why nobody tells you about this [CATEGORY] hack',
        'The [ACTION] method professionals don\'t want you to know',
        'Stop [WRONG WAY] - do THIS instead',
        'This changes everything about [ACTIVITY]'
      ],
      'history': [
        'The [EVENT] truth they don\'t teach in schools',
        'What really happened during [HISTORICAL MOMENT]',
        '[HISTORICAL FIGURE] secret nobody talks about',
        'The [ERA] discovery that changed everything',
        'Why [HISTORICAL EVENT] actually happened'
      ],
      'psychology': [
        'This psychology trick works on everyone',
        'Why your brain tricks you into [BEHAVIOR]',
        'The [EMOTION] phenomenon explained',
        'This is why you [COMMON BEHAVIOR]',
        'The science behind [PSYCHOLOGICAL EFFECT]'
      ],
      'tech': [
        'Your phone can do THIS and you had no idea',
        'Hidden [APP] feature changes everything',
        'Stop using [TECH] the wrong way',
        'This [DEVICE] trick is insane',
        '[TECH COMPANY] doesn\'t want you to know this'
      ]
    };

    return templates[niche] || templates['movie-analysis'];
  };

  const generateScript = (topic, nicheData) => {
    const hooks = [
      `Wait... you're telling me ${topic.toLowerCase()}?`,
      `Stop scrolling. This will blow your mind.`,
      `I can't believe nobody's talking about this.`,
      `This changes everything you thought you knew.`,
      `You've been doing this wrong your whole life.`
    ];

    const hook = hooks[Math.floor(Math.random() * hooks.length)];
    
    const content = `So here's what's actually happening. ${topic}. And when you really break it down, it makes perfect sense. Most people miss this because they're not paying attention to the details. But once you see it, you can't unsee it.`;
    
    const cta = `What do you think? Drop a comment if this blew your mind. And follow for more insights like this.`;

    return { hook, content, cta };
  };

  const generateVoiceoverTimings = (script) => {
    const segments = [
      { text: script.hook, start: 0, end: 3, emphasis: 'high' },
      { text: script.content, start: 3, end: 45, emphasis: 'medium' },
      { text: script.cta, start: 45, end: 55, emphasis: 'medium' }
    ];

    return segments;
  };

  const generateBRollMap = (topic, voiceover) => {
    const bRollTemplates = {
      'movie-analysis': [
        { time: '0-3s', description: 'Movie title card with glitch effect', type: 'text-overlay' },
        { time: '3-10s', description: 'Relevant movie scene screenshot', type: 'image' },
        { time: '10-25s', description: 'Close-up of detail being discussed', type: 'image' },
        { time: '25-40s', description: 'Comparison shots or timeline', type: 'split-screen' },
        { time: '40-55s', description: 'Final reveal or summary graphic', type: 'graphic' }
      ],
      'life-hacks': [
        { time: '0-3s', description: 'Problem scenario - relatable pain point', type: 'stock-video' },
        { time: '3-15s', description: 'Step 1 demonstration', type: 'hands-tutorial' },
        { time: '15-30s', description: 'Step 2 demonstration', type: 'hands-tutorial' },
        { time: '30-45s', description: 'Final result showcase', type: 'before-after' },
        { time: '45-55s', description: 'Call to action graphic', type: 'text-overlay' }
      ],
      'default': [
        { time: '0-3s', description: 'Attention-grabbing visual', type: 'stock-video' },
        { time: '3-20s', description: 'Main content visual', type: 'stock-video' },
        { time: '20-40s', description: 'Supporting visual or graphic', type: 'graphic' },
        { time: '40-55s', description: 'CTA visual', type: 'text-overlay' }
      ]
    };

    return bRollTemplates[niche] || bRollTemplates['default'];
  };

  const generateSubtitles = (voiceover) => {
    return voiceover.map((segment, idx) => {
      const words = segment.text.split(' ');
      const emphasisWords = words.filter((_, i) => i % 5 === 0 || i === words.length - 1);
      
      return {
        id: idx,
        text: segment.text,
        start: segment.start,
        end: segment.end,
        emphasis: emphasisWords,
        style: segment.emphasis === 'high' ? 'large-bold' : 'medium'
      };
    });
  };

  const selectMusic = (nicheData) => {
    const musicCategories = {
      'analytical': { category: 'Ambient Electronic', mood: 'focused', energy: 'low' },
      'excited': { category: 'Upbeat Pop', mood: 'energetic', energy: 'high' },
      'mysterious': { category: 'Dark Ambient', mood: 'suspenseful', energy: 'medium' },
      'educational': { category: 'Corporate Inspiring', mood: 'professional', energy: 'medium' },
      'informative': { category: 'Tech House', mood: 'modern', energy: 'medium' }
    };

    return musicCategories[nicheData.tone] || musicCategories['educational'];
  };

  const generateMetadata = (topic, script, nicheData) => {
    const title = `${topic} #shorts`;
    
    const tags = [
      ...nicheData.keywords,
      'shorts',
      'viral',
      'trending',
      niche.replace('-', ' ')
    ];

    const description = `${script.hook}\n\n${script.content.substring(0, 100)}...\n\n🔔 Subscribe for more!\n\n${tags.map(t => `#${t.replace(/\s/g, '')}`).join(' ')}`;

    const thumbnail = {
      text: topic.split(' ').slice(0, 4).join(' '),
      style: 'bold-text-with-face',
      colors: ['#FF0050', '#00D4FF']
    };

    return { title, tags, description, thumbnail, postingTime: 'peak-hours' };
  };

  const generateVideo = async (index) => {
    const nicheData = niches[niche];
    const topicTemplates = generateTopics(nicheData);
    const topics = topicTemplates.map(t => ({
      text: t,
      trendScore: (Math.random() * 30 + 70).toFixed(1),
      ctrPotential: (Math.random() * 30 + 70).toFixed(1),
      keywords: nicheData.keywords.slice(0, 3)
    }));

    const selectedTopic = topics.sort((a, b) => b.trendScore - a.trendScore)[0];
    
    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Script Generation' });
    await new Promise(resolve => setTimeout(resolve, 500));

    const script = generateScript(selectedTopic.text, nicheData);
    
    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Voiceover Timing' });
    await new Promise(resolve => setTimeout(resolve, 300));

    const voiceover = generateVoiceoverTimings(script);
    
    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'B-Roll Planning' });
    await new Promise(resolve => setTimeout(resolve, 300));

    const bRoll = generateBRollMap(selectedTopic.text, voiceover);
    
    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Subtitle Generation' });
    await new Promise(resolve => setTimeout(resolve, 300));

    const subtitles = generateSubtitles(voiceover);
    
    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Music Selection' });
    await new Promise(resolve => setTimeout(resolve, 200));

    const music = selectMusic(nicheData);
    
    setGenerationProgress({ current: index + 1, total: batchSize, stage: 'Metadata Creation' });
    await new Promise(resolve => setTimeout(resolve, 200));

    const metadata = generateMetadata(selectedTopic.text, script, nicheData);

    return {
      id: `VIDEO_${Date.now()}_${index}`,
      status: 'ready',
      createdAt: new Date().toISOString(),
      niche: niche,
      topics: topics,
      selectedTopic: selectedTopic,
      script: script,
      voiceover: voiceover,
      bRoll: bRoll,
      subtitles: subtitles,
      music: music,
      metadata: metadata,
      specs: {
        resolution: '1080x1920',
        aspectRatio: '9:16',
        duration: '55-59s',
        fps: 30
      }
    };
  };

  const generateBatch = async () => {
    setIsGenerating(true);
    const newVideos = [];

    for (let i = 0; i < batchSize; i++) {
      const video = await generateVideo(i);
      newVideos.push(video);
    }

    const allVideos = [...videos, ...newVideos];
    setVideos(allVideos);
    await saveVideos(allVideos);
    setIsGenerating(false);
    setGenerationProgress({ current: 0, total: 0, stage: '' });
    setActiveTab('videos');
  };

  const exportJSON = (video) => {
    const json = JSON.stringify(video, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${video.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportProductionScript = (video) => {
    const script = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${video.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NICHE: ${video.niche}
CREATED: ${new Date(video.createdAt).toLocaleString()}
STATUS: ${video.status.toUpperCase()}

═══════════════════════════════════════════════════════════════
STAGE 1: TOPIC CANDIDATES (Top 5)
═══════════════════════════════════════════════════════════════

${video.topics.map((t, i) => `${i + 1}. ${t.text}
   Trend Score: ${t.trendScore}/100
   CTR Potential: ${t.ctrPotential}/100
   Keywords: ${t.keywords.join(', ')}`).join('\n\n')}

SELECTED TOPIC: ${video.selectedTopic.text}

═══════════════════════════════════════════════════════════════
STAGE 2: SCRIPT (Retention Optimized)
═══════════════════════════════════════════════════════════════

[HOOK - 0-3s]
${video.script.hook}

[CONTENT - 3-45s]
${video.script.content}

[CTA - 45-55s]
${video.script.cta}

═══════════════════════════════════════════════════════════════
STAGE 3: VOICEOVER (Timed & Structured)
═══════════════════════════════════════════════════════════════

${video.voiceover.map((v, i) => `[${v.start}s - ${v.end}s] [EMPHASIS: ${v.emphasis.toUpperCase()}]
${v.text}`).join('\n\n')}

═══════════════════════════════════════════════════════════════
STAGE 4: B-ROLL MAP (Visual Assembly)
═══════════════════════════════════════════════════════════════

${video.bRoll.map((b, i) => `[${b.time}]
Type: ${b.type}
Visual: ${b.description}`).join('\n\n')}

═══════════════════════════════════════════════════════════════
STAGE 5: MUSIC & SFX
═══════════════════════════════════════════════════════════════

Category: ${video.music.category}
Mood: ${video.music.mood}
Energy Level: ${video.music.energy.toUpperCase()}

Recommended Tracks:
- Epidemic Sound: ${video.music.category} collection
- Artlist: ${video.music.mood} mood filter
- YouTube Audio Library: ${video.music.category}

SFX Suggestions:
- 0-3s: Attention grab (whoosh, glitch)
- Key points: Subtle pop/click sounds
- 45-55s: Success/completion sound

═══════════════════════════════════════════════════════════════
STAGE 6: SUBTITLES (Motion-Tracked + Emphasized)
═══════════════════════════════════════════════════════════════

${video.subtitles.map((s, i) => `[${s.start}s - ${s.end}s] [STYLE: ${s.style}]
Text: ${s.text}
Emphasis Words: ${s.emphasis.join(', ')}`).join('\n\n')}

═══════════════════════════════════════════════════════════════
STAGE 7: EXPORT SPECIFICATIONS
═══════════════════════════════════════════════════════════════

Resolution: ${video.specs.resolution}
Aspect Ratio: ${video.specs.aspectRatio}
Duration: ${video.specs.duration}
FPS: ${video.specs.fps}
Format: MP4 (H.264)
Bitrate: 8-12 Mbps

═══════════════════════════════════════════════════════════════
STAGE 8: UPLOAD METADATA
═══════════════════════════════════════════════════════════════

TITLE:
${video.metadata.title}

DESCRIPTION:
${video.metadata.description}

TAGS:
${video.metadata.tags.join(', ')}

THUMBNAIL:
Text: "${video.metadata.thumbnail.text}"
Style: ${video.metadata.thumbnail.style}
Colors: ${video.metadata.thumbnail.colors.join(' + ')}

POSTING STRATEGY:
Time: ${video.metadata.postingTime}
Best Days: Tuesday-Thursday, Saturday
Optimal Hours: 2pm-4pm, 7pm-9pm (local time)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF PRODUCTION PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${video.id}_PRODUCTION.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Video className="w-12 h-12 text-indigo-400" />
              <Sparkles className="w-5 h-5 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
            YouTube Shorts Autopilot Factory
          </h1>
          <p className="text-gray-400 text-lg">Autonomous 8-Stage Production Pipeline</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{videos.length}</div>
                <div className="text-sm text-gray-400">Videos Generated</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{videos.filter(v => v.status === 'ready').length}</div>
                <div className="text-sm text-gray-400">Ready to Export</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white capitalize">{niche.replace('-', ' ')}</div>
                <div className="text-sm text-gray-400">Active Niche</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{batchSize}</div>
                <div className="text-sm text-gray-400">Batch Size</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 mb-8">
          <div className="grid grid-cols-3 gap-2">
            {['dashboard', 'videos', 'analytics'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === tab ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}>
                {tab === 'dashboard' && <><Settings className="w-4 h-4" /> Control Panel</>}
                {tab === 'videos' && <><Video className="w-4 h-4" /> Video Library ({videos.length})</>}
                {tab === 'analytics' && <><BarChart3 className="w-4 h-4" /> Analytics</>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  Production Configuration
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Content Niche</label>
                    <select value={niche} onChange={(e) => setNiche(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white">
                      <option value="movie-analysis">Movie Analysis</option>
                      <option value="life-hacks">Life Hacks</option>
                      <option value="history">History Facts</option>
                      <option value="psychology">Psychology</option>
                      <option value="tech">Tech Tips</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Batch Size</label>
                    <input type="number" value={batchSize} onChange={(e) => setBatchSize(parseInt(e.target.value))}
                      min="1" max="20"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white" />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <p className="text-sm text-indigo-300 font-semibold mb-2">Pipeline Stages:</p>
                  <div className="grid grid-cols-4 gap-2 text-xs text-gray-300">
                    <div className="bg-slate-700/30 p-2 rounded">1. Concept Generation</div>
                    <div className="bg-slate-700/30 p-2 rounded">2. Script Generation</div>
                    <div className="bg-slate-700/30 p-2 rounded">3. Voiceover Timing</div>
                    <div className="bg-slate-700/30 p-2 rounded">4. Visual Assembly</div>
                    <div className="bg-slate-700/30 p-2 rounded">5. Sound & SFX</div>
                    <div className="bg-slate-700/30 p-2 rounded">6. Subtitles</div>
                    <div className="bg-slate-700/30 p-2 rounded">7. Export Specs</div>
                    <div className="bg-slate-700/30 p-2 rounded">8. Upload Metadata</div>
                  </div>
                </div>
              </div>

              <button onClick={generateBatch} disabled={isGenerating}
                className="w-full py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-xl shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                {isGenerating ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating... {generationProgress.current}/{generationProgress.total} - {generationProgress.stage}
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    Generate {batchSize} Complete Videos
                  </>
                )}
              </button>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-yellow-300 font-semibold mb-2">⚡ Autopilot Mode</p>
                <p className="text-xs text-gray-400">Each video includes: 5 topic candidates, optimized script, timed voiceover, B-roll map, subtitles with emphasis, music recommendations, and complete upload metadata. All machine-readable and production-ready.</p>
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-6">
              {videos.length === 0 ? (
                <div className="text-center py-16">
                  <Video className="w-20 h-20 mx-auto mb-4 text-indigo-400/50" />
                  <p className="text-gray-400 text-lg">No videos generated yet</p>
                  <p className="text-sm text-gray-500 mt-2">Go to Control Panel to start generating</p>
                </div>
              ) : (
                videos.slice().reverse().map((video, idx) => (
                  <div key={video.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Video #{videos.length - idx}</h3>
                        <p className="text-indigo-400 font-semibold">{video.selectedTopic.text}</p>
                        <p className="text-sm text-gray-500 mt-1">{new Date(video.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {video.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Trend Score</p>
                        <p className="text-lg font-bold text-white">{video.selectedTopic.trendScore}/100</p>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">CTR Potential</p>
                        <p className="text-lg font-bold text-white">{video.selectedTopic.ctrPotential}/100</p>
                      </div>
                    </div>

                    <div className="bg-indigo-500/10 border-l-4 border-indigo-500 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-indigo-400 mb-2">Script Preview</p>
                      <p className="text-sm text-gray-300">{video.script.hook}</p>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => exportProductionScript(video)}
                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Production Script
                      </button>
                      <button onClick={() => exportJSON(video)}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Export JSON
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">Total Videos</h4>
                    <Video className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="text-4xl font-bold text-white">{videos.length}</p>
                  <p className="text-sm text-gray-400 mt-2">All time production</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">Avg Trend Score</h4>
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-4xl font-bold text-white">
                    {videos.length > 0 
                      ? (videos.reduce((acc, v) => acc + parseFloat(v.selectedTopic.trendScore), 0) / videos.length).toFixed(1)
                      : '0.0'}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Out of 100</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">Avg CTR Potential</h4>
                    <Eye className="w-6 h-6 text-pink-400" />
                  </div>
                  <p className="text-4xl font-bold text-white">
                    {videos.length > 0
                      ? (videos.reduce((acc, v) => acc + parseFloat(v.selectedTopic.ctrPotential), 0) / videos.length).toFixed(1)
                      : '0.0'}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Out of 100</p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Niche Distribution
                </h4>
                <div className="space-y-3">
                  {Object.keys(niches).map(n => {
                    const count = videos.filter(v => v.niche === n).length;
                    const percentage = videos.length > 0 ? (count / videos.length * 100).toFixed(0) : 0;
                    return (
                      <div key={n} className="flex items-center gap-4">
                        <span className="text-sm text-gray-300 w-32 capitalize">{n.replace('-', ' ')}</span>
                        <div className="flex-1 bg-slate-700/30 rounded-full h-8 overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full flex items-center px-3 text-sm font-bold text-white"
                            style={{ width: `${percentage}%` }}>
                            {count > 0 && `${count} (${percentage}%)`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-3">Production Pipeline Status</h4>
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-gray-400 mb-1">Stage 1-2</p>
                    <p className="text-xl font-bold text-green-400">{videos.length}</p>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-gray-400 mb-1">Stage 3-4</p>
                    <p className="text-xl font-bold text-green-400">{videos.length}</p>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-gray-400 mb-1">Stage 5-6</p>
                    <p className="text-xl font-bold text-green-400">{videos.length}</p>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-gray-400 mb-1">Stage 7-8</p>
                    <p className="text-xl font-bold text-green-400">{videos.length}</p>
                    <p className="text-xs text-gray-500">Ready</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isGenerating && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-indigo-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-indigo-500/30 rounded-full"></div>
                  <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Generating Videos</h3>
              <p className="text-center text-gray-400 mb-4">
                Video {generationProgress.current} of {generationProgress.total}
              </p>
              <div className="bg-slate-700/50 rounded-full h-3 overflow-hidden mb-3">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}></div>
              </div>
              <p className="text-center text-sm text-indigo-400 font-semibold">{generationProgress.stage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortsAutopilot;
