import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { getOverallRating, getAllRatings } from "@/pages/api/rating";
import AddUpdateRating from "@/components/rating/AddUpdateRating";
import localforage from "localforage";

export default function Home() {
  const [auth, setAuth] = useState(null);

  //===== check is user login start =====
  useEffect(() => {
    const getToken = async () => {
      const token = await localforage.getItem("token");
      if (token) {
        setAuth(token);
      }
    };
    getToken();
  }, []);
  //===== check is user login end =====

  // ======== Fetch overall rating ==========
  const { data: overallRatingData } = useQuery(
    "overallRating",
    getOverallRating
  );
  // console.log(overallRatingData);
  // console.log(overallRatingData?.overallRating);
  // ======== Fetch overall rating end ==========

  // ======== Fetch all ratings ==========
  const { data: ratingsData } = useQuery("ratings", getAllRatings);
  // console.log(ratingsData);
  // console.log(ratingsData?.ratings);
  // console.log(ratingsData?.ratings[0].customer.name);
  // ======== Fetch all ratings end ==========

  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 gap-12 md:flex md:px-8">
        <div className="flex-1">
          <div className="max-w-lg">
            <h3 className="font-semibold text-indigo-600">HealthCare Center</h3>
            <p className="mt-3 text-gray-800 text-3xl font-extrabold sm:text-4xl">
              Welcome to the HealthCare Center
            </p>

            <h1>All Ratings: {overallRatingData?.overallRating}</h1>
            <ReactStars
              count={5} // Number of stars
              size={50} // Size of stars
              activeColor="#ffd700" // Color of active (filled) stars
              edit={false} // Make the stars read-only
              value={overallRatingData?.overallRating} // Set the initial rating value
            />

            <address className="mt-6 text-gray-700">
              2, Lebuh Acheh, George Town, 10300 George Town, Pulau Pinang
            </address>
            <div> {auth && <AddUpdateRating />}</div>
          </div>
        </div>

        <div className="flex-1 mt-12 md:mt-0">
          <ul className="space-y-4 divide-y">
            {ratingsData?.ratings.map((item) => (
              <li className="py-5" key={item._id}>
                <summary className="flex items-center justify-between font-semibold text-gray-700">
                  {item.customer.username}
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Ratings: {item.rating}
                  <ReactStars
                    count={5} // Number of stars
                    size={30} // Size of stars
                    activeColor="#ffd700" // Color of active (filled) stars
                    edit={false} // Make the stars read-only
                    value={item.rating} // Set the initial rating value
                  />
                </p>
                {/* Display the AddUpdateRating component only if the user is authenticated and the rating belongs to the current user */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
