import { useState, ChangeEvent } from "react";
import { StyleFeedback } from "../../../Models/OutfitModel";
import { stylistService, StyleMeResult } from "../../../Services/StylistService";
import { notify } from "../../../Utils/Notify";
import "./Home.css";

export function Home() {
    // 1. Image & Context State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [occasion, setOccasion] = useState<string>("evening drinks with friends");
    const [location, setLocation] = useState<string>("Tel Aviv");

    // 2. Loading & Feedback State
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [isCurating, setIsCurating] = useState<boolean>(false);
    const isBusy = isAnalyzing || isCurating;
    const [feedback, setFeedback] = useState<StyleFeedback | null>(null);

    // Style Me State
    const [styleMeResult, setStyleMeResult] = useState<StyleMeResult | null>(null);

    async function handleStyleMe() {
        setIsCurating(true);
        setStyleMeResult(null);
        setFeedback(null);
        try {
            const result = await stylistService.styleMeFromWardrobe({
                occasion: occasion,
                location: location
            });
            setStyleMeResult(result);
            setFeedback(result.feedback);
            notify.success("Outfit curated from your wardrobe!");
        } catch (err: any) {
            notify.error(err);
        } finally {
            setIsCurating(false);
        }
    }

    // 3. Handle image file selection and convert to Base64
    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setFeedback(null); // Clear previous results on new image
                setStyleMeResult(null);
            };
            reader.readAsDataURL(file);
        }
    }

    // 4. Submit handler for visual analysis
    async function handleAnalyze() {
        if (!selectedImage) {
            notify.error("Please upload or take a photo of your outfit / clothing items first.");
            return;
        }

        setIsAnalyzing(true);
        try {
            const result = await stylistService.analyzeOutfitImage({
                imageBase64: selectedImage,
                occasion: occasion,
                location: location
            });
            setFeedback(result);
            notify.success("Outfit analysis complete!");
        } catch (err: any) {
            notify.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    }

    // Dynamic score color helper
    function getScoreClass(score: number): string {
        if (score >= 80) return "score-high";
        if (score >= 65) return "score-medium";
        return "score-low";
    }

    return (
        <div className="Home">
            <header className="home-header">
                <h1>FASHION INTELLIGENCE STUDIO</h1>
                <p>Computer Vision Outfit Detection • Proportions • Color Theory • Context</p>
            </header>

            {/* Input Section - Visual Dropzone & Context */}
            <div className="outfit-studio-card">
                
                {/* Image Upload Area */}
                <div className="upload-container">
                    <label className={`dropzone ${selectedImage ? "has-image" : ""}`}>
                        {selectedImage ? (
                            <div className="preview-wrapper">
                                <img src={selectedImage} alt="Outfit Preview" className="preview-image" />
                                <span className="change-photo-badge">Tap / Click to Change Photo</span>
                            </div>
                        ) : (
                            <div className="dropzone-placeholder">
                                <div className="upload-icon">📸</div>
                                <h3>Upload Outfit Photo</h3>
                                <p>Mirror selfie, worn outfit, or flat-lay garments on bed / floor</p>
                                <span className="browse-btn">Choose Photo</span>
                            </div>
                        )}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="visually-hidden-input"
                        />
                    </label>
                </div>

                {/* Context Row: Occasion & Location */}
                <div className="context-row">
                    <div className="input-field">
                        <label htmlFor="occasion-input">Target Event & Vibe</label>
                        <input
                            id="occasion-input"
                            type="text" 
                            value={occasion} 
                            onChange={(e) => setOccasion(e.target.value)} 
                            placeholder="e.g. casual date, rooftop party, art gallery" 
                        />
                    </div>

                    <div className="input-field">
                        <label htmlFor="location-input">Location / City (Weather Context)</label>
                        <input
                            id="location-input"
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            placeholder="e.g. Tel Aviv, New York, London" 
                        />
                    </div>
                </div>

                {/* Submit Action */}
                <button 
                    className={`analyze-btn ${isAnalyzing ? "btn-loading" : ""}`}
                    onClick={handleAnalyze}
                    disabled={isBusy || !selectedImage}
                >
                    {isAnalyzing ? (
                        <>
                            <span className="spinner"></span>
                            <span>Computer Vision Scanning & Evaluating...</span>
                        </>
                    ) : (
                        "Analyze Outfit from Photo"
                    )}
                </button>

                {/* Secondary Action - Style Me from DB */}
                <div className="style-me-section">
                    <span className="style-me-divider">— OR CURATE FROM YOUR CLOSET —</span>
                    <button 
                        className="style-me-btn" 
                        onClick={handleStyleMe} 
                        disabled={isBusy}
                        type="button"
                    >
                        {isCurating ? (
                            <>
                                <span className="spinner"></span>
                                <span>Curating from your closet...</span>
                            </>
                        ) : (
                            "✨ Curate Outfit from My Wardrobe"
                        )}
                    </button>
                </div>
            </div>

            {/* Output Section */}
            {feedback && (
                <div className="results-container">
                    
                    {/* Detected Items Pill Banner */}
                    {feedback.detectedOutfit && (
                        <div className="detected-banner">
                            <div className="detected-header">
                                <span className="detected-icon">👁️</span>
                                <h4>DETECTED BY COMPUTER VISION</h4>
                            </div>
                            <div className="detected-tags">
                                <div className="detected-pill">
                                    <span className="pill-label">Upper:</span>
                                    <strong>{feedback.detectedOutfit.top.color} {feedback.detectedOutfit.top.type}</strong>
                                </div>
                                <div className="detected-pill">
                                    <span className="pill-label">Lower:</span>
                                    <strong>{feedback.detectedOutfit.bottom.color} {feedback.detectedOutfit.bottom.type}</strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Style Me Curated Pieces Banner */}
                    {styleMeResult && (
                        <div className="curated-banner">
                            <div className="curated-header">
                                <span className="curated-icon">✨</span>
                                <div>
                                    <h4>CURATED FROM YOUR WARDROBE</h4>
                                    <p className="rationale-text">"{styleMeResult.stylingRationale}"</p>
                                </div>
                            </div>
                            <div className="curated-cards-grid">
                                <div className="curated-item-card">
                                    <span className="curated-category">UPPER PIECE</span>
                                    <h3>{styleMeResult.selectedOutfit.top.name}</h3>
                                    <span className="curated-meta">{styleMeResult.selectedOutfit.top.color} • {styleMeResult.selectedOutfit.top.fit}</span>
                                </div>
                                <div className="curated-item-card">
                                    <span className="curated-category">LOWER PIECE</span>
                                    <h3>{styleMeResult.selectedOutfit.bottom.name}</h3>
                                    <span className="curated-meta">{styleMeResult.selectedOutfit.bottom.color} • {styleMeResult.selectedOutfit.bottom.fit}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Overall Verdict Banner */}
                    <div className="verdict-banner">
                        <div className="score-display">
                            <span className={`score-large ${getScoreClass(feedback.totalScore)}`}>
                                {feedback.totalScore}
                            </span>
                            <span className="score-max">/100</span>
                        </div>
                        <div className="verdict-details">
                            <h3>MASTER STYLIST VERDICT</h3>
                            <p>{feedback.verdict}</p>
                        </div>
                    </div>

                    {/* Agents Grid */}
                    <div className="agents-grid">
                        {/* Silhouette Agent */}
                        <div className="agent-card">
                            <div className="agent-card-header">
                                <span className="agent-tag">VOLUME & DRAPE</span>
                                <span className={`agent-score-badge ${getScoreClass(feedback.silhouette.score)}`}>
                                    {feedback.silhouette.score}
                                </span>
                            </div>
                            <h4>Silhouette Specialist</h4>
                            <p className="agent-feedback">{feedback.silhouette.feedback}</p>
                            {feedback.silhouette.ruleBreak && (
                                <div className="rule-violation-tag">
                                    ⚠️ {feedback.silhouette.ruleBreak}
                                </div>
                            )}
                        </div>

                        {/* Color Harmony Agent */}
                        <div className="agent-card">
                            <div className="agent-card-header">
                                <span className="agent-tag">PALETTE HARMONY</span>
                                <span className={`agent-score-badge ${getScoreClass(feedback.colorHarmony.score)}`}>
                                    {feedback.colorHarmony.score}
                                </span>
                            </div>
                            <h4>Color Specialist</h4>
                            <div className="palette-pill">
                                Mode: <strong>{feedback.colorHarmony.palette}</strong>
                            </div>
                            <p className="agent-feedback">{feedback.colorHarmony.feedback}</p>
                        </div>

                        {/* Occasion Agent */}
                        <div className="agent-card">
                            <div className="agent-card-header">
                                <span className="agent-tag">CONTEXT & DRESS CODE</span>
                                <span className={`agent-score-badge ${getScoreClass(feedback.occasionMatch.score)}`}>
                                    {feedback.occasionMatch.score}
                                </span>
                            </div>
                            <h4>Occasion Specialist</h4>
                            <p className="agent-feedback">{feedback.occasionMatch.feedback}</p>
                        </div>
                    </div>

                    {/* Actionable Tips */}
                    {feedback.actionableTips.length > 0 && (
                        <div className="tips-panel">
                            <h4>DIRECTOR'S REFINEMENT NOTES</h4>
                            <div className="tips-list">
                                {feedback.actionableTips.map((tip, idx) => (
                                    <div className="tip-item" key={idx}>
                                        <span className="tip-bullet">✦</span>
                                        <p>{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
