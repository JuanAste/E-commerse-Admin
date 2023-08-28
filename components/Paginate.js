export default function Paginate({
  page,
  setPage,
  disabledButton,
  setDisabledButton,
  params,
  amount,
}) {
  return (
    <div className="flex gap-8 justify-center mt-3">
      <button
        disabled={page === 1}
        onClick={() => {
          setPage(page - 1);
        }}
        className="btn-primary"
      >
        {page - 1}
      </button>
      <h2 className="font-medium mb-0 mt-1">{page}</h2>
      <button
        disabled={!params.length || params.length < amount || disabledButton}
        onClick={() => {
          setPage(page + 1);
          setDisabledButton(true);
        }}
        className="btn-primary"
      >
        {page + 1}
      </button>
    </div>
  );
}
