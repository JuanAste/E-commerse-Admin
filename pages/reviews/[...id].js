import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import imageErr404 from "../../Images/error 404.png";
import Layout from "@/components/Layout";
import TrashIcon from "@/components/icons/TrashIcon";
import { withSwal } from "react-sweetalert2";

function ReviewsPage({ swal }) {
  const router = useRouter();
  const { id } = router.query;
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id?.length) {
      axios
        .get("/api/reviews", {
          params: {
            page: page,
            _id: id[0],
          },
        })
        .then((res) => {
          if (res.data.length) {
            setReviews([...reviews, ...res.data]);
          } else {
            setMessage("No more Reviews");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [id, page]);

  function deleteReview(rev) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete this review?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = rev;
          await axios.delete("/api/reviews?_id=" + _id);
          setReviews((prev) => {
            const upload = prev.filter((review) => review._id !== rev._id);
            return upload;
          });
        }
      });
  }

  return (
    <div>
      <Layout>
        {reviews?.map((rev) => (
          <div
            key={rev._id}
            className=" p-7 border border-gray-600 m-3 rounded-md relative"
          >
            <button
              onClick={() => deleteReview(rev)}
              className="z-10 absolute top-1 right-1"
            >
              <TrashIcon bg={"red"} />
            </button>
            <div className=" flex  justify-between">
              <div className=" flex text-center justify-center items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className=" w-8 h-auto rounded-full"
                  src={rev.image || imageErr404.src}
                  alt=""
                />
                {rev.name || "<Unknown>"}
              </div>
              <div>
                {rev.createdAt !== rev.updatedAt ? <span>(edit)</span> : null}{" "}
                {new Date(rev.createdAt).toLocaleDateString("es-ES")}
              </div>
            </div>
            <div className=" font-bold">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    color: star <= rev.score ? "gold" : "lightgray",
                  }}
                >
                  &#9733;
                </span>
              ))}
            </div>
            {rev.comment}
          </div>
        ))}
        <div className=" text-center">
          {!!message && <p className=" text-red-500 mb-2">{message}</p>}
          <button
            className=" bg-slate-500 p-2 px-5 text-white"
            disabled={message ? true : false}
            onClick={() => setPage(page + 1)}
          >
            Load more
          </button>
        </div>
      </Layout>
    </div>
  );
}

export default withSwal(({ swal }, ref) => <ReviewsPage swal={swal} />);
