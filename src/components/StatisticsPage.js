import React, { useState, useEffect, useCallback } from 'react';
import { 
    FaDownload, FaList, FaAngleLeft, FaAngleRight, 
    FaStar, FaRegStar, FaStarHalfAlt, // For customer reviews
    FaChartLine // Added for page title icon
} from 'react-icons/fa';

// --- LOADER COMPONENT (Reused) ---
const LOADER_COLOR = '#3a3a37ff'; // Primary color for consistency (Dark Blue)
const LoaderSpinner = ({ text }) => (
    <div className="loader-container">
        <div className="bar-spinner-container">
            <div className="bar bar-1"></div>
            <div className="bar bar-2"></div>
            <div className="bar bar-3"></div>
            <div className="bar bar-4"></div>
            <div className="bar bar-5"></div>
        </div>
        <p className="loading-text-spinner">{text || 'Loading Report Data...'}</p>
    </div>
);

// --- UTILITY FUNCTIONS ---
const formatCurrency = (amount, currency = '$') => {
    if (typeof amount !== 'number' || isNaN(amount)) return `${currency} 0.00`;
    return `${currency} ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

// --- MOCK DATA ---
const mockDashboardData = {
    totalIncomes: 18765,
    incomeChange: 2.6, // percentage increase
    lastMonthText: "last month", // As seen in image
    booked: {
        pending: 9.91,
        canceled: 1.95,
        sold: 9.12,
        totalTours: 20.98, // Sum of pending, canceled, sold
    },
    bookingsSummary: {
        soldPercentage: 73.9,
        soldValue: 38566,
        pendingPercentage: 45.6,
        pendingValue: 18472,
    },
    toursAvailable: {
        total: 186,
        soldOut: 120,
        available: 66,
    },
    statisticsChart: {
        yearlyData: {
            labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
            sold: [85, 45, 30, 40, 25, 90], // Example data (as percentage for height)
            canceled: [50, 40, 20, 30, 45, 40], // Example data
        },
        selectedYear: '2023', // Default selected year
    },
    customerReviews: [
        {
            id: 1,
            author: 'Jayvion Simon',
            date: '21 Nov 2023',
            rating: 4.5,
            comment: 'Occaecati ea et elo quibusdam accusamus qui. Incidunt aut et molestias ut facere aut. Et quid iusto praesentium excepturi harum nihil tenetur facilite. Ut omnis voluptates nihil accusatium doloribus eaque debitis.',
            tags: ['Great service', 'Recommended', 'Best price']
        },
        // Add more mock reviews if needed
    ]
};

// --- Helper Components for visual elements ---

const ProgressBar = ({ label, value, max, color, unit = 'k' }) => {
    const percentage = (value / max) * 100;
    return (
        <div className="progress-bar-container">
            <div className="progress-bar-label">
                <span>{label}</span>
                <span>{value}{unit}</span>
            </div>
            <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
            </div>
        </div>
    );
};

const DonutChartPlaceholder = ({ percentage, label, value, color }) => (
    <div className="donut-chart-card">
        <div className="donut-chart-visual-wrapper">
            <div className="donut-chart-placeholder" style={{ 
                background: `conic-gradient(${color} ${percentage}%, #f0f0f0 ${percentage}%)`
            }}>
                <div className="donut-chart-center">
                    <span>{percentage}%</span>
                    <span>{label}</span>
                </div>
            </div>
        </div>
        <div className="donut-chart-value">{formatCurrency(value)}</div>
    </div>
);

const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="rating-stars">
            {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
            {hasHalfStar && <FaStarHalfAlt key="half" />}
            {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
        </div>
    );
};

// --- STATISTICS PAGE COMPONENT ---

const StatisticsPage = ({ navigateTo }) => {
    const [data, setData] = useState(mockDashboardData);
    const [loading, setLoading] = useState(false);
    const [selectedChartYear, setSelectedChartYear] = useState(data.statisticsChart.selectedYear);

    // In a real app, this would fetch data based on filters or a selected period
    const fetchData = useCallback(async () => {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        setData(mockDashboardData); 
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleYearChange = (e) => {
        setSelectedChartYear(e.target.value);
    };

    const barChartData = data.statisticsChart.yearlyData;

    return (
        <div className="statistics-page-container">
            
            {/* Header (Back button and title) */}
            <header className="page-header statistics-header">
                <button className="back-button" onClick={() => navigateTo('/reports')}>
                    <FaAngleLeft />
                </button>
                {/* 🛑 Updated Title */}
                <h2><FaChartLine style={{ marginRight: '8px' }} /> Statistics Dashboard</h2>
                <div className="header-actions">
                    <button className="btn-primary-action" onClick={() => console.log('Exporting Stats')} title="Export Data" disabled={loading}>
                        <FaDownload /> Export
                    </button>
                    <button className="btn-secondary-action" onClick={() => navigateTo('/reports')} title="View All Reports" disabled={loading}>
                        <FaList /> View List
                    </button>
                </div>
            </header>

            {loading ? (
                // 🛑 Display Loader when loading
                <LoaderSpinner text="Loading Statistics Dashboard..." />
            ) : (
                <div className="dashboard-grid">
                    {/* Top Row: Total Incomes, Booked Status, Tours Available */}
                    <div className="card income-card">
                        <div className="card-header-small">
                            <span className="title">Total incomes</span>
                            <span className="change" style={{ color: data.incomeChange > 0 ? 'rgba(255,255,255,0.8)' : '#e74c4c' }}>
                                {data.incomeChange > 0 ? '+' : ''}{data.incomeChange}% {data.lastMonthText}
                            </span>
                        </div>
                        <div className="income-value">{formatCurrency(data.totalIncomes)}</div>
                        <div className="income-chart-placeholder">
                            {/* Placeholder for small line chart */}
                        </div>
                    </div>

                    <div className="card booked-status-card">
                        <div className="card-header-small">
                            <span className="title">Booked</span>
                        </div>
                        <div className="progress-bars-area">
                            <ProgressBar 
                                label="PENDING" 
                                value={data.booked.pending} 
                                max={data.booked.totalTours} 
                                color="#f39c12" 
                            />
                            <ProgressBar 
                                label="CANCELED" 
                                value={data.booked.canceled} 
                                max={data.booked.totalTours} 
                                color="#e74c4c" 
                            />
                            <ProgressBar 
                                label="SOLD" 
                                value={data.booked.sold} 
                                max={data.booked.totalTours} 
                                color="#2ecc71" 
                            />
                        </div>
                    </div>

                    <div className="card tours-available-card">
                        <div className="card-header-small">
                            <span className="title">Tours available</span>
                        </div>
                        <div className="tours-donut-wrapper">
                            <div className="tours-donut-chart-placeholder" style={{
                                background: `conic-gradient(#2ecc71 ${((data.toursAvailable.available / data.toursAvailable.total) * 100)}%, #e0e0e0 ${((data.toursAvailable.available / data.toursAvailable.total) * 100)}%)`
                            }}>
                                <div className="tours-donut-center">
                                    <span>Tours</span>
                                    <span>{data.toursAvailable.total}</span>
                                </div>
                            </div>
                        </div>
                        <div className="tours-legend">
                            <div><span className="legend-color-box green"></span> Sold out ({data.toursAvailable.soldOut})</div>
                            <div><span className="legend-color-box gray"></span> Available ({data.toursAvailable.available})</div>
                        </div>
                    </div>

                    {/* Middle Row: Donut Chart Summaries */}
                    <DonutChartPlaceholder 
                        percentage={data.bookingsSummary.soldPercentage} 
                        label="Sold" 
                        value={data.bookingsSummary.soldValue} 
                        color="#2ecc71" 
                    />
                    <DonutChartPlaceholder 
                        percentage={data.bookingsSummary.pendingPercentage} 
                        label="Pending for payment" 
                        value={data.bookingsSummary.pendingValue} 
                        color="#f39c12" 
                    />

                    {/* Bottom Row: Statistics Bar Chart and Customer Reviews */}
                    <div className="card statistics-chart-card">
                        <div className="card-header-flex">
                            <span className="title">Statistics</span>
                            <div className="chart-legend-small">
                                <span className="legend-color-box green"></span> Sold
                                <span className="legend-color-box orange" style={{marginLeft: '10px'}}></span> Canceled
                            </div>
                            <select value={selectedChartYear} onChange={handleYearChange} className="yearly-select">
                                {barChartData.labels.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="bar-chart-placeholder">
                            {/* Placeholder for Bar Chart */}
                            <div className="y-axis-label">Count</div>
                            <div className="bar-chart-bars">
                                {barChartData.labels.map((year, index) => (
                                    <div key={year} className="bar-group">
                                        <div className="bar sold" style={{ height: `${barChartData.sold[index]}%` }}></div>
                                        <div className="bar canceled" style={{ height: `${barChartData.canceled[index]}%` }}></div>
                                        <span className="x-axis-label">{year}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card customer-reviews-card">
                        <div className="card-header-flex">
                            <span className="title">Customer reviews</span>
                            <div className="review-nav">
                                <FaAngleLeft className="nav-arrow" />
                                <FaAngleRight className="nav-arrow" />
                            </div>
                        </div>
                        {data.customerReviews.map(review => (
                            <div key={review.id} className="review-item">
                                <div className="review-author-info">
                                    <img src="https://via.placeholder.com/40" alt="Author" className="author-avatar" />
                                    <div>
                                        <div className="author-name">{review.author}</div>
                                        <div className="review-date">{review.date}</div>
                                    </div>
                                </div>
                                <RatingStars rating={review.rating} />
                                <p className="review-comment">{review.comment}</p>
                                <div className="review-tags">
                                    {review.tags.map(tag => (
                                        <span key={tag} className="review-tag">{tag}</span>
                                    ))}
                                </div>
                                <div className="review-actions">
                                    <button className="reject-btn">Reject</button>
                                    <button className="accept-btn">Accept</button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}

            {/* Injected Styles */}
            <style jsx global>{`
                /* General Reset & Body Styles */
                body {
                    margin: 0;
                    font-family: 'Roboto', sans-serif;
                    background-color: #f0f3fa;
                    color: #333;
                }
                
                /* 🛑 LOADER STYLES */
                .loader-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 0;
                    background-color: transparent; 
                    min-height: 50vh;
                    width: 100%;
                }
                .loading-text-spinner {
                    margin-top: 15px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: ${LOADER_COLOR};
                }
                
                .bar-spinner-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 50px; 
                    height: 40px;
                }

                .bar {
                    width: 5px;
                    height: 100%;
                    background-color: ${LOADER_COLOR};
                    margin: 0 2px;
                    display: inline-block;
                    animation: bar-stretch 1s infinite ease-in-out;
                    border-radius: 3px;
                }
                
                .bar-1 { animation-delay: -1.0s; }
                .bar-2 { animation-delay: -0.8s; }
                .bar-3 { animation-delay: -0.6s; }
                .bar-4 { animation-delay: -0.4s; }
                .bar-5 { animation-delay: -0.2s; }

                @keyframes bar-stretch {
                    0%, 100% { transform: scaleY(0.1); opacity: 0.5; }
                    50% { transform: scaleY(1.0); opacity: 1; }
                }
                /* END LOADER STYLES */

                /* Container for the entire statistics page */
                .statistics-page-container {
                    padding: 0;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                /* Header Styling */
                .page-header.statistics-header {
                    display: flex;
                    align-items: center;
                    padding: 15px 20px;
                    background-color: white; 
                    border-bottom: 1px solid #eee;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.04);
                }

                .statistics-header .back-button {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #5c6bc0;
                    cursor: pointer;
                    margin-right: 15px;
                    display: flex;
                    align-items: center;
                }
                .statistics-header .back-button:hover {
                    color: #4a5aa8;
                }

                .statistics-header h2 {
                    flex-grow: 1;
                    font-size: 1.4rem;
                    color: #333;
                    margin: 0;
                }

                .header-actions button {
                    margin-left: 10px;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }
                .btn-primary-action {
                    background-color: transparent;
                    color: #5c6bc0;
                    border: 1px solid #5c6bc0;
                }
                .btn-primary-action:hover {
                    background-color: #f0f0f5;
                }
                .btn-secondary-action {
                    background-color: #5c6bc0;
                    color: white;
                    border: 1px solid #5c6bc0;
                }
                .btn-secondary-action:hover {
                    background-color: #4a5aa8;
                }
                .header-actions button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                /* Dashboard Grid Layout */
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    padding: 20px;
                    flex-grow: 1;
                }

                /* General Card Styling */
                .card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                }

                .card-header-small {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    font-size: 0.85rem;
                    color: #777;
                }
                .card-header-small .title {
                    font-weight: 500;
                    color: #333;
                }
                .card-header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                .card-header-flex .title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #333;
                }

                /* 1. Income Card */
                .income-card {
                    grid-column: span 1;
                    background-color: #1abc9c;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding-bottom: 0;
                    overflow: hidden;
                }
                .income-card .card-header-small {
                    color: rgba(255,255,255,0.8);
                }
                .income-card .card-header-small .title {
                    color: white;
                }
                .income-value {
                    font-size: 2.2rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                .income-chart-placeholder {
                    background-color: rgba(0,0,0,0.1);
                    height: 80px;
                    margin: 0 -20px -1px -20px;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }

                /* 2. Booked Status Card */
                .booked-status-card {
                    grid-column: span 2;
                }
                .progress-bar-container {
                    margin-bottom: 10px;
                }
                .progress-bar-label {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    color: #333;
                    margin-bottom: 5px;
                }
                .progress-bar-bg {
                    background-color: #f0f0f0;
                    border-radius: 5px;
                    height: 8px;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    border-radius: 5px;
                }

                /* 3. Tours Available Card */
                .tours-available-card {
                    grid-column: span 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                .tours-donut-wrapper {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    margin: 20px auto;
                }
                .tours-donut-chart-placeholder {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .tours-donut-center {
                    position: absolute;
                    width: 80px;
                    height: 80px;
                    background-color: white;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-size: 0.8rem;
                    color: #777;
                    font-weight: 500;
                }
                .tours-donut-center span:first-child {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #333;
                }
                .tours-legend {
                    display: flex;
                    justify-content: center;
                    font-size: 0.8rem;
                    color: #777;
                    margin-top: 10px;
                }
                .tours-legend > div {
                    display: flex;
                    align-items: center;
                    margin: 0 5px;
                }
                .legend-color-box {
                    width: 10px;
                    height: 10px;
                    border-radius: 2px;
                    margin-right: 5px;
                }
                .legend-color-box.green { background-color: #2ecc71; }
                .legend-color-box.gray { background-color: #e0e0e0; }
                .legend-color-box.orange { background-color: #f39c12; }


                /* 4 & 5. Donut Chart Cards (Sold & Pending) */
                .donut-chart-card {
                    grid-column: span 2;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding-right: 30px;
                }
                .donut-chart-visual-wrapper {
                    position: relative;
                    width: 100px;
                    height: 100px;
                }
                .donut-chart-placeholder {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .donut-chart-center {
                    position: absolute;
                    width: 70px;
                    height: 70px;
                    background-color: white;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-size: 0.8rem;
                    color: #777;
                    font-weight: 500;
                }
                .donut-chart-center span:first-child {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #333;
                }
                .donut-chart-value {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #333;
                    flex-grow: 1;
                    text-align: right;
                }
                
                /* 6. Statistics Bar Chart Card */
                .statistics-chart-card {
                    grid-column: span 2;
                    min-height: 350px;
                }
                .statistics-chart-card .card-header-flex {
                    margin-bottom: 20px;
                }
                .chart-legend-small {
                    display: flex;
                    align-items: center;
                    font-size: 0.8rem;
                    color: #777;
                }
                .yearly-select {
                    padding: 5px 10px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                    font-size: 0.85rem;
                    color: #333;
                    background-color: white;
                    cursor: pointer;
                }
                .bar-chart-placeholder {
                    height: 200px;
                    display: flex;
                    align-items: flex-end;
                    gap: 15px;
                    border-left: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;
                    padding-left: 10px;
                    position: relative;
                }
                .y-axis-label {
                    position: absolute;
                    left: -5px;
                    top: 50%;
                    transform: rotate(-90deg) translateY(50%);
                    font-size: 0.8rem;
                    color: #777;
                    white-space: nowrap;
                }
                .bar-chart-bars {
                    display: flex;
                    flex-grow: 1;
                    justify-content: space-around;
                    align-items: flex-end;
                    height: 100%;
                }
                .bar-group {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 30px;
                    height: 100%;
                    justify-content: flex-end;
                    position: relative;
                }
                .bar {
                    width: 12px;
                    border-radius: 3px 3px 0 0;
                    margin-bottom: 2px;
                }
                .bar.sold { background-color: #2ecc71; }
                .bar.canceled { background-color: #f39c12; }
                .x-axis-label {
                    position: absolute;
                    bottom: -25px;
                    font-size: 0.75rem;
                    color: #777;
                }


                /* 7. Customer Reviews Card */
                .customer-reviews-card {
                    grid-column: span 2;
                    overflow-y: auto;
                    max-height: 400px;
                    padding-right: 10px;
                }
                .customer-reviews-card .card-header-flex {
                    position: sticky;
                    top: -20px;
                    background-color: white;
                    z-index: 10;
                    padding-top: 5px;
                    padding-bottom: 15px;
                    margin-left: -20px;
                    margin-right: -20px;
                    padding-left: 20px;
                    padding-right: 20px;
                    border-bottom: 1px solid #eee;
                    margin-bottom: 0;
                }
                .review-nav {
                    display: flex;
                    gap: 5px;
                }
                .nav-arrow {
                    font-size: 1.2rem;
                    color: #777;
                    cursor: pointer;
                }
                .nav-arrow:hover {
                    color: #333;
                }
                .review-item {
                    border-bottom: 1px solid #f0f0f0;
                    padding: 20px 0;
                }
                .review-item:last-child {
                    border-bottom: none;
                }
                .review-author-info {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .author-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-right: 10px;
                }
                .author-name {
                    font-weight: 600;
                    color: #333;
                }
                .review-date {
                    font-size: 0.75rem;
                    color: #777;
                }
                .rating-stars {
                    color: #f39c12;
                    margin-bottom: 10px;
                    font-size: 0.9rem;
                }
                .review-comment {
                    font-size: 0.9rem;
                    line-height: 1.5;
                    color: #555;
                    margin-bottom: 10px;
                }
                .review-tags {
                    margin-bottom: 15px;
                }
                .review-tag {
                    display: inline-block;
                    background-color: #f0f3fa;
                    color: #5c6bc0;
                    font-size: 0.75rem;
                    padding: 5px 10px;
                    border-radius: 15px;
                    margin-right: 8px;
                    margin-bottom: 5px;
                }
                .review-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }
                .review-actions button {
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-weight: 500;
                }
                .reject-btn {
                    background-color: #fcebeb;
                    color: #e74c4c;
                    border: 1px solid #e74c4c;
                }
                .reject-btn:hover {
                    background-color: #e74c4c;
                    color: white;
                }
                .accept-btn {
                    background-color: #d4edda;
                    color: #28a745;
                    border: 1px solid #28a745;
                }
                .accept-btn:hover {
                    background-color: #28a745;
                    color: white;
                }

                /* Responsive Adjustments */
                @media (max-width: 1200px) {
                    .dashboard-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .booked-status-card { grid-column: span 2; }
                    .income-card, .tours-available-card { grid-column: span 1; }
                    .donut-chart-card { grid-column: span 3; }
                    .statistics-chart-card, .customer-reviews-card { grid-column: span 3; }
                }

                @media (max-width: 900px) {
                    .dashboard-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .booked-status-card { grid-column: span 2; }
                    .income-card, .tours-available-card { grid-column: span 1; }
                    .donut-chart-card { grid-column: span 2; }
                    .statistics-chart-card, .customer-reviews-card { grid-column: span 2; }
                }

                @media (max-width: 600px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                    .income-card, .booked-status-card, .tours-available-card, 
                    .donut-chart-card, .statistics-chart-card, .customer-reviews-card {
                        grid-column: span 1;
                    }
                    .donut-chart-card {
                        flex-direction: column;
                        text-align: center;
                    }
                    .donut-chart-value {
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default StatisticsPage;