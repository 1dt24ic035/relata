type AlreadyJoinedMessageProps = {
  onClose: () => void;
};

export default function AlreadyJoinedMessage({
  onClose,
}: AlreadyJoinedMessageProps) {
  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-5">📧</div>

      <h2 className="text-3xl font-bold mb-3">
        You're Already on the Waitlist!
      </h2>

      <p className="text-gray-400 mb-8">
        Great news! We've already reserved your spot.
        <br />
        We'll email you as soon as Relata launches.
      </p>

      <button
        onClick={onClose}
        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-4 font-semibold hover:scale-[1.02] transition"
      >
        Awesome 🚀
      </button>
    </div>
  );
}