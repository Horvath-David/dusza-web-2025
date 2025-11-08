import { Plus } from "lucide-react"
import { Button } from "~/components/ui/button"

const CollectionModifier = () => {
    return (
        <main className="p-5">
            <h1 className="text-5xl font-bold text-center">Hozd létre a gyűjteményed!</h1>
            <section className="flex flex-col items-center mt-7">
                <div className="flex flex-col gap-2">

                <h2 className="text-xl">Gyűjteményed</h2>
                <div className="w-[50em] h-[30em] border-2 border-white rounded-2xl">

                </div>
                <Button>
                    <Plus></Plus>
                    Új hozzáadása
                </Button>
                </div>
            </section>
        </main>
    )
}

export default CollectionModifier