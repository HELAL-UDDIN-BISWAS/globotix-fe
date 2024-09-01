module.exports = new Proxy(
	{},
	{
		get: function getter() {
			return () => ({
				className: "mocked-font",
			});
		},
	}
);
