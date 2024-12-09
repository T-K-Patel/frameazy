import { Card, CardContent } from "@/components/ui/card";

type Variant = {
	borderWidth: number;
	unit_price: number;
};

type VariantSelectorProps = {
	variants: Variant[];
	onSelect: (index: number) => void;
	selectedVariant: number;
};

export function VariantSelector({ variants, onSelect, selectedVariant }: VariantSelectorProps) {
	const handleSelect = (index: number) => {
		onSelect(index);
	};

	return (
		<div className="flex flex-wrap gap-3">
			{variants.map((variant, index) => (
				<Card
					onClick={() => handleSelect(index)}
					key={index}
					className={`border ${
						selectedVariant === index ? "bg-primary text-white" : "border-primary"
					} cursor-pointer select-none hover:shadow-lg`}
				>
					<CardContent className="p-3">
						<p className="text-xs">
							{variant.borderWidth}
							<strong> In</strong>{" "}
						</p>
						<p className="text-xs">₹{(variant.unit_price / 100).toLocaleString()}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
