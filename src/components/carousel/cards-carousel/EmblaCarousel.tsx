import React, { ReactNode } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import './embla.css'

type PropType = {
    slides: ReactNode[]
    options?: EmblaOptionsType
}

const CardsCarousel: React.FC<PropType> = (props) => {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className="embla2">
            <div className="embla__viewport2" ref={emblaRef}>
                <div className="embla__container2">
                    {slides.map((node, index) => (
                        <div className="embla__slide2" key={index}>
                            <div className="embla__slide__number2">
                                {node}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla__controls">
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
        </section>
    )
}

export default CardsCarousel
