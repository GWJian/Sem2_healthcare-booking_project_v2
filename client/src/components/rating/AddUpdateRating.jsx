import React, { useState } from "react";
import Swal from "sweetalert2";
import ReactStars from "react-stars";
import { getProfile } from "@/pages/api/profile";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { updateRating, addRating, getAllRatings } from "@/pages/api/rating";

export default function AddUpdateRating() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { data: selfData } = useQuery("profile", getProfile);
  const { data: ratingsData } = useQuery("ratings", getAllRatings);

  const [rating, setRating] = useState(ratingsData?.rating || 0);

  const handleAddRating = () => {
    addRatingMutation({
      rating,
    });
  };

  const { mutate: addRatingMutation } = useMutation(addRating, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("ratings");
      queryClient.invalidateQueries("overallRating");
      Swal.fire({
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      setIsAdding(false);
    },
  });

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const { mutate: updateRatingMutation } = useMutation(updateRating, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("ratings");
      queryClient.invalidateQueries("overallRating");
      Swal.fire({
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      setIsEditing(false);
    },
  });

  const handleEditRating = () => {
    updateRatingMutation({
      rating,
      id: ratingsData?._id,
    });
  };

  const handleCancleEditRating = () => {
    setIsEditing(false);
    setRating(ratingsData?.rating); // Reset the rating
  };

  // console.log(ratingsData.ratings[2].customer._id);
  // console.log(selfData?._id);

  //make a const to compare the customer id in the rating list with the customer id in the profile
  const findRating = ratingsData?.ratings.find(
    (rating) => rating.customer._id === selfData?._id
  );

  return (
    <div>
      {isEditing ? (
        <>
          <ReactStars
            count={5}
            size={24}
            activeColor="#ffd700"
            value={rating}
            onChange={handleRatingChange}
          />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            onClick={handleEditRating}
          >
            Update
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={handleCancleEditRating}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          {findRating?.customer?._id === selfData?._id ? (
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <>
              {isAdding ? (
                <>
                  <ReactStars
                    count={5}
                    size={24}
                    activeColor="#ffd700"
                    value={rating}
                    onChange={handleRatingChange}
                  />
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                    onClick={handleAddRating}
                  >
                    Confirm
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={() => setIsAdding(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                  onClick={() => setIsAdding(true)}
                >
                  Add Rating
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

// console.log(findRating);
