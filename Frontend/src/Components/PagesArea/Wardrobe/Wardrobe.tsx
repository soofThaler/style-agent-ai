import { useState, useEffect } from "react";
import { GarmentModel } from "../../../Models/GarmentModel";
import { wardrobeService } from "../../../Services/WardrobeService";
import { notify } from "../../../Utils/Notify";
import "./Wardrobe.css";

export function Wardrobe() {
    const [garments, setGarments] = useState<GarmentModel[]>([]);
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deletingIds, setDeletingIds] = useState<number[]>([]);

    useEffect(() => {
        loadWardrobe();
    }, []);

    async function loadWardrobe() {
        setIsLoading(true);
        try {
            const items = await wardrobeService.getAllGarments();
            setGarments(items);
        } catch (err: any) {
            notify.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id?: number) {
        if (!id || deletingIds.includes(id)) return;
        setDeletingIds(prev => [...prev, id]);
        try {
            await wardrobeService.deleteGarment(id);
            setGarments(prev => prev.filter(g => g.id !== id));
            notify.success("Item removed from your wardrobe.");
        } catch (err: any) {
            notify.error(err);
        } finally {
            setDeletingIds(prev => prev.filter(x => x !== id));
        }
    }

    const filtered = filterCategory === "all" 
        ? garments 
        : garments.filter(g => g.category === filterCategory);

    return (
        <div className="Wardrobe">
            <header className="wardrobe-header">
                <div className="wardrobe-title-row">
                    <div>
                        <h1>MY DIGITAL WARDROBE</h1>
                        <p>AI-Detected & Curated Clothing Inventory ({garments.length} items)</p>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="wardrobe-filters">
                    {["all", "top", "bottom", "shoes"].map(cat => (
                        <button 
                            key={cat}
                            className={`filter-btn ${filterCategory === cat ? "active" : ""}`}
                            type="button"
                            aria-pressed={filterCategory === cat}
                            onClick={() => setFilterCategory(cat)}
                        >
                            {cat.toUpperCase()} ({cat === "all" ? garments.length : garments.filter(g => g.category === cat).length})
                        </button>
                    ))}
                </div>
            </header>

            {isLoading ? (
                <div className="wardrobe-loading" role="status">
                    <span className="spinner"></span>
                    <p>Loading your wardrobe...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="wardrobe-empty">
                    <span className="empty-icon" aria-hidden="true">🧥</span>
                    {garments.length === 0 ? (
                        <>
                            <h3>Your wardrobe is empty</h3>
                            <p>Upload outfits in the Studio to automatically extract and register pieces into your wardrobe.</p>
                        </>
                    ) : (
                        <>
                            <h3>No items in this category</h3>
                            <p>Try another filter to see the rest of your wardrobe.</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="wardrobe-grid">
                    {filtered.map(item => (
                        <div key={item.id} className="garment-tile">
                            <div className="tile-top">
                                <span className="category-tag">{item.category.toUpperCase()}</span>
                                <button 
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => handleDelete(item.id)}
                                    disabled={!!item.id && deletingIds.includes(item.id)}
                                    aria-label={`Delete ${item.name}`}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="tile-body">
                                <h3>{item.name}</h3>
                                <div className="tile-meta">
                                    <span className="meta-pill">Color: <strong>{item.color}</strong></span>
                                    <span className="meta-pill">Fit: <strong>{item.fit}</strong></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}