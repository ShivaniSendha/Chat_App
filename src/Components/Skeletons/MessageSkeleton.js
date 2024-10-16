import '../../Styling/Skeleton.css'
const MessageSkeleton = () => {
	return (
		<>
			<div className="skeleton-container">
				<div className="skeleton sender">
					<div className="skeleton-avatar"></div>
					<div className="skeleton-text">
						<div className="skeleton-line"></div>
						<div className="skeleton-line"></div>
					</div>
				</div>
				<div className="skeleton receiver">
					<div className="skeleton-text">
						<div className="skeleton-line"></div>
					</div>
					<div className="skeleton-avatar"></div>
				</div>
			</div>
		</>
	);
};

export default MessageSkeleton;
