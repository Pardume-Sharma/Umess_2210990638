import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './Reviews.css';
import { StoreContext } from '../../components/context/StoreContext';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hostelFilter, setHostelFilter] = useState(""); 
    const [hostels, setHostels] = useState([]); 

    const {url} = useContext(StoreContext);
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${url}/api/review/all`);
            setReviews(response.data.reviews);
            const uniqueHostels = [...new Set(response.data.reviews.map(review => review.hostel.toLowerCase()))];
            setHostels(uniqueHostels);
        } catch (error) {
            setError('Failed to load reviews. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [url]);

    const deleteReview = async (reviewId) => {
        try {
            const response = await axios.delete(`${url}/api/review/delete/${reviewId}`);
            if (response.data.success) {
                setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
            }
            await fetchReviews();
        } catch (error) {
            if (error.response) {
                setError('Failed to delete review: ' + error.response.data.message);
            } else {
                setError('Failed to delete review. Please try again.');
            }
        }
    };
    useEffect(() => {
        const fetchHostels = async () => {
          try {
            const response = await axios.get(
              `${url}/api/hostel/getHostels`
            );
            if (response.data.success) {
              const hostelNames = response.data.hostels.map((hostel) => hostel.name);
              setHostels(hostelNames);
            }
          } catch (err) {
            console.error("Error fetching hostels: ", err);
          }
        };
        fetchHostels();
      }, []);
      
    if (loading) return <p>Loading reviews...</p>;
    if (error) return <p>{error}</p>;

    const filteredReviews = hostelFilter 
        ? reviews.filter(review => review.hostel === hostelFilter)
        : reviews;

    return (
        <div className="reviews-container">
            <h2>Student Reviews</h2>
            <div className="filter-container">
                <label htmlFor="hostelFilter">Filter by Hostel: </label>
                <select 
                    id="hostelFilter" 
                    value={hostelFilter} 
                    onChange={(e) => setHostelFilter(e.target.value)}
                >
                    <option value="">All Hostels</option>
                    {hostels.map((hostel, index) => (
                        <option key={index} value={hostel}>{hostel}</option>
                    ))}
                </select>
            </div>

            {filteredReviews.length > 0 ? (
                <div className="review-list">
                    {filteredReviews.map((review) => (
                        <div key={review._id} className="review-item">
                            <div className="review-field"><strong>Name:</strong> {review.name}</div>
                            <div className="review-field"><strong>Hostel:</strong> {review.roomNumber} {review.hostel}</div>
                            <div className="review-field"><strong>Email:</strong> {review.emailId}</div>
                            <div className="review-field"><strong>Roll Number:</strong> {review.rollNumber}</div>
                            <div className="review-field"><p><strong>Comment: </strong> {review.reviewText}</p></div>
                            <div>
                                <p><strong>Submitted At: </strong>{format(new Date(review.submittedAt), 'MMMM d, yyyy h:mm a')}</p>
                            </div>
                            <button onClick={() => deleteReview(review._id)} className="delete-button">Delete</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No reviews available yet.</p>
            )}
        </div>
    );
};

export default Reviews;
